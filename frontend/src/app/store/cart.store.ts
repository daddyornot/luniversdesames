import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { LocalStorageService } from '../core/local-storage/local-storage';
import { ToastService } from '../services/toast/toast';
import { CartItem } from '../core/models/cart';

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: []
};

export const CartStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed(({ items }) => ({
        totalPrice: computed(() =>
            items().reduce((total, item) => total + (item.price * item.quantity), 0)
        ),
        count: computed(() =>
            items().reduce((count, item) => count + item.quantity, 0)
        ),
        isEmpty: computed(() => items().length === 0)
    })),

    withMethods((store,
                 storage = inject(LocalStorageService),
                 toast = inject(ToastService)
    ) => {
        // Fonction utilitaire interne pour centraliser la sauvegarde
        const save = (items: CartItem[]) => storage.setItem('cart', JSON.stringify(items));

        return {
            addToCart(product: CartItem) {
                const currentItems = store.items();
                const existingItem = currentItems.find(item =>
                    item.id === product.id &&
                    item.selectedVariant?.id === product.selectedVariant?.id &&
                    item.selectedSize?.id === product.selectedSize?.id
                );

                let newItems: CartItem[];
                if (existingItem) {
                    newItems = currentItems.map(i =>
                        i === existingItem ? { ...i, quantity: i.quantity + product.quantity } : i
                    );
                } else {
                    newItems = [...currentItems, product];
                }

                patchState(store, { items: newItems });
                save(newItems); // Sauvegarde explicite
                toast.showSuccess(`${product.name} ajouté au panier !`);
            },

            updateQuantity(id: number, delta: number) {
                const newItems = store.items().map(item => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : item;
                    }
                    return item;
                });

                patchState(store, { items: newItems });
                save(newItems);
            },

            removeItem(id: number) {
                const newItems = store.items().filter(item => item.id !== id);
                patchState(store, { items: newItems });
                save(newItems);
            },

            clearCart() {
                patchState(store, { items: [] });
                storage.removeItem('cart');
            },

            _loadFromStorage() {
                const saved = storage.getItem('cart');
                if (saved) {
                    patchState(store, { items: JSON.parse(saved) });
                }
            }
        };
    }),

    withHooks({
        onInit(store) {
            store._loadFromStorage();
        }
    })
);
