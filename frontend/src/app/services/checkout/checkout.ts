// export class CheckoutComponent {
//   private http = inject(HttpClient);
//   private toast = inject(ToastService);
//
//   validerCommande(data: any) {
//     this.toast.loading.set(true);
//
//     this.http.post('http://localhost:8080/api/orders', data).subscribe({
//       next: (response) => {
//         this.toast.showSuccess('Commande enregistrée ! Un email vous a été envoyé.');
//         this.toast.loading.set(false);
//       },
//       error: (err) => {
//         // On récupère le champ "message" défini dans ton ErrorResponse Java
//         const errorMessage = err.error?.message || 'Une erreur est survenue';
//         this.toast.showError(errorMessage);
//         this.toast.loading.set(false);
//       }
//     });
//   }
// }
