import {inject} from '@angular/core';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, EMPTY, pipe, switchMap, tap} from 'rxjs';
import {setError, setLoaded, setLoading, withCallState} from '@angular-architects/ngrx-toolkit';
import {OrderControllerService, OrderDTO, OrderRequest} from '../core/api';

type OrderState = {
  orders: OrderDTO[];
};

const initialState: OrderState = {
  orders: []
};

export const OrderStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withCallState(),

  withMethods((store, orderApi = inject(OrderControllerService)) => ({

    /**
     * Charger l'historique des commandes de l'utilisateur
     */
    loadMyOrders: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setLoading())),
        switchMap(() => orderApi.getMyOrders().pipe(
          tap((orders) => {
            patchState(store, {orders, ...setLoaded()});
          }),
          catchError((err) => {
            patchState(store, setError(err.message));
            return EMPTY;
          })
        ))
      )
    ),

    /**
     * Créer une commande
     * @param request Le DTO de la commande
     * @param onSuccess Callback pour rediriger ou vider le panier
     * @param onError Callback en cas d'erreur (ex: vider le panier quand même)
     */
    createOrder: rxMethod<{
      request: OrderRequest,
      onSuccess?: (order: OrderDTO) => void,
      onError?: (error: any) => void
    }>(
      pipe(
        tap(() => patchState(store, setLoading())),
        switchMap(({request, onSuccess, onError}) => orderApi.createOrder(request).pipe(
          tap((newOrder) => {
            patchState(store, (state) => ({
              orders: [newOrder, ...state.orders],
              ...setLoaded()
            }));
            if (onSuccess) onSuccess(newOrder);
          }),
          catchError((err) => {
            patchState(store, setError(err.message));
            if (onError) onError(err);
            return EMPTY;
          })
        ))
      )
    ),

    /**
     * Télécharger une facture (Gestion du Blob)
     */
    downloadInvoice: rxMethod<{ orderId: number, invoiceNumber: string }>(
      pipe(
        switchMap(({orderId, invoiceNumber}) => orderApi.downloadOrderInvoice(orderId).pipe(
          tap((blob: Blob) => {
            // Création du lien de téléchargement
            const url = globalThis.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `facture-${invoiceNumber}.pdf`;
            link.click();
            globalThis.URL.revokeObjectURL(url);
          }),
          catchError((err) => {
            alert('Erreur lors du téléchargement de la facture');
            return EMPTY;
          })
        ))
      )
    )
  }))
);
