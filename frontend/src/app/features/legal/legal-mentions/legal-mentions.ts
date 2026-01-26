import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-legal-mentions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-stone-50 py-12 px-6">
      <div class="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <h1 class="font-serif text-3xl text-spirit-primary mb-8 text-center">Mentions Légales & Confidentialité</h1>

        <div class="space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 class="font-bold text-gray-800 mb-2">1. Éditeur du site (Propriétaire)</h2>
            <p>
              Le site <strong>L'Univers des Âmes</strong> est édité par <strong>[Nom de votre compagne]</strong>,
              entrepreneur individuel (Auto-entrepreneur).
            </p>
            <p class="mt-2">
              <strong>SIRET :</strong> [Numéro SIRET]<br>
              <strong>Siège social :</strong> [Adresse complète de l'entreprise]<br>
              <strong>Email de contact :</strong> [Email de contact de l'entreprise]<br>
              <strong>Téléphone :</strong> [Numéro de téléphone professionnel]
            </p>
            <p class="mt-2">
              <strong>Directeur de la publication :</strong> [Nom de votre compagne]
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">2. Conception et Développement</h2>
            <p>
              Le site a été conçu et développé par :<br>
              <strong>[Votre Nom / Votre Structure si applicable]</strong><br>
              [Votre Site Web si applicable]<br>
              [Votre Email de contact]
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">3. Hébergement</h2>
            <p>
              Le site est hébergé par :<br>
              <strong>[Nom de l'hébergeur]</strong> (ex: OVH, Vercel, AWS...)<br>
              [Adresse de l'hébergeur]<br>
              [Site web de l'hébergeur]
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la
              propriété intellectuelle.
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les
              représentations iconographiques et photographiques.
              Toute reproduction ou représentation intégrale ou partielle de ce site, par quelque procédé que ce soit,
              sans l'autorisation expresse de l'éditeur est interdite et constituerait une contrefaçon sanctionnée par
              le Code de la propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">5. Données personnelles</h2>
            <p>
              Les informations recueillies sur ce site sont enregistrées dans un fichier informatisé par <strong>[Nom de
              votre compagne]</strong> pour la gestion des commandes et de la relation client.
              Elles sont conservées pendant la durée nécessaire à la gestion de la relation commerciale et sont
              destinées à l'usage exclusif de L'Univers des Âmes.
            </p>
            <p class="mt-2">
              Conformément à la loi « Informatique et Libertés », vous disposez d'un droit d'accès, de modification et
              de suppression des données vous concernant.
              Pour l'exercer, vous pouvez nous contacter à l'adresse suivante : [Email de contact].
            </p>
          </section>

          <section>
            <h2 class="font-bold text-gray-800 mb-2">6. Cookies</h2>
            <p>
              Ce site utilise des cookies pour assurer son bon fonctionnement et améliorer votre expérience utilisateur.
            </p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Cookies essentiels :</strong> Ces cookies sont nécessaires au fonctionnement du site (gestion
                du panier, authentification). Ils ne nécessitent pas de consentement préalable.
              </li>
              <li><strong>Cookies de mesure d'audience (si applicable) :</strong> Nous n'utilisons pas actuellement de
                cookies de suivi publicitaire intrusifs.
              </li>
            </ul>
            <p class="mt-2">
              Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies, mais cela pourrait altérer
              le fonctionnement du site (ex: perte du panier).
            </p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class LegalMentionsComponent {}
