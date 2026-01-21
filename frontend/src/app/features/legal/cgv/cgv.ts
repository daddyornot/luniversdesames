import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-cgv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-stone-50 py-12 px-6">
      <div class="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <h1 class="font-serif text-3xl text-spirit-primary mb-8 text-center">Conditions Générales de Vente</h1>

        <div class="space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 class="font-bold text-gray-800 mb-2">1. Objet</h2>
            <p>
              Les présentes conditions générales de vente ont pour objet, d'une part, d'informer tout éventuel consommateur sur les conditions et modalités dans lesquelles le vendeur procède à la vente et à la livraison des produits commandés, et d'autre part, de définir les droits et obligations des parties dans le cadre de la vente de produits par le vendeur au consommateur.
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">2. Prix</h2>
            <p>
              Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC), sauf indication contraire et hors frais de traitement et d'expédition.
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">3. Commande</h2>
            <p>
              Le client peut passer commande sur le site Internet [URL du site]. Le processus de commande comprend plusieurs étapes : sélection des produits, validation du panier, identification, choix du mode de livraison et paiement.
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">4. Paiement</h2>
            <p>
              Le règlement de vos achats s'effectue par carte bancaire grâce au système sécurisé Stripe. Le débit de la carte est effectué au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">5. Livraison</h2>
            <p>
              Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande. Les délais indiqués sont des délais moyens habituels et correspondent aux délais de traitement et de livraison.
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">6. Rétractation</h2>
            <p>
              Conformément aux dispositions légales en vigueur, vous disposez d'un délai de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalité.
            </p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class CgvComponent {}
