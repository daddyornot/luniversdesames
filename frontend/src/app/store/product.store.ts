import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { setError, setLoaded, setLoading, withCallState } from '@angular-architects/ngrx-toolkit';
import { ProductControllerService, ProductDTO } from '../core/api';

// 1. Définition de l'état
type ProductState = {
    items: ProductDTO[];
    selectedProduct: ProductDTO | null;
};

const initialState: ProductState = {
    items: [],
    selectedProduct: null
};

export const ProductStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    // Gère loading, loaded, error
    withCallState(),

    // 2. Signaux calculés
    withComputed(({ items }) => ({
        physicalProducts: computed(() => {
            const data = items();
            return Array.isArray(data)
                ? data.filter(p => p.type === ProductDTO.TypeEnum.Physical)
                : [];
        }),

        serviceProducts: computed(() => {
            const data = items();
            return Array.isArray(data)
                ? data.filter(p => p.type !== ProductDTO.TypeEnum.Physical)
                : [];
        }),

        count: computed(() => items().length)
    })),

    // 3. Méthodes (Actions)
    withMethods((store, productService = inject(ProductControllerService)) => ({

        loadAll: rxMethod<void>(
            pipe(
                tap(() => patchState(store, setLoading())),
                switchMap(() => productService.getAllProducts().pipe(
                    tap((products) => {
                        // On s'assure de stocker un tableau vide si null
                        patchState(store, { items: products ?? [], ...setLoaded() });
                    }),
                    catchError((err) => {
                        patchState(store, setError(err.message));
                        return EMPTY;
                    })
                ))
            )
        ),

        /**
         * VERSION HYBRIDE : Cache + Network
         */
        getById: rxMethod<number>(
            pipe(
                tap((id) => {
                    // 1. On cherche d'abord en cache local
                    const cachedProduct = store.items().find(p => p.id === id);
                    if (cachedProduct) {
                        patchState(store, { selectedProduct: cachedProduct });
                        // On ne met pas "setLoading" si on a déjà un cache pour éviter les spinners inutiles
                    } else {
                        patchState(store, setLoading());
                    }
                }),
                switchMap((id) => productService.getProductById(id).pipe(
                    tap((refreshedProduct) => {
                        // 2. Mise à jour du store avec la version fraîche de l'API
                        patchState(store, {
                            selectedProduct: refreshedProduct,
                            ...setLoaded()
                        });

                        // 3. Bonus : On met aussi à jour la liste globale si le produit a changé
                        patchState(store, (state) => ({
                            items: state.items.map(p => p.id === refreshedProduct.id ? refreshedProduct : p)
                        }));
                    }),
                    catchError((err) => {
                        patchState(store, setError(err.message));
                        return EMPTY;
                    })
                ))
            )
        ),

        // /**
        //  * Suppression d'un produit
        //  */
        // deleteProduct: rxMethod<number>(
        //     pipe(
        //         switchMap((id) => productService.deleteProduct(id).pipe(
        //             tap(() => {
        //                 patchState(store, (state) => ({
        //                     items: state.items.filter(p => p.id !== id),
        //                     // Si on vient de supprimer le produit sélectionné, on vide la sélection
        //                     selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct
        //                 }));
        //             }),
        //             catchError((err) => {
        //                 alert('Erreur lors de la suppression : ' + err.message);
        //                 return EMPTY;
        //             })
        //         ))
        //     )
        // ),

        updateLocalProduct(updated: ProductDTO) {
            patchState(store, (state) => ({
                items: state.items.map(p => p.id === updated.id ? updated : p),
                selectedProduct: state.selectedProduct?.id === updated.id ? updated : state.selectedProduct
            }));
        }
    })),

    withHooks({
        onInit(store) {
            // Optionnel : ne charger que si la liste est vide
            if (store.items().length === 0) {
                store.loadAll();
            }
        }
    })
);
