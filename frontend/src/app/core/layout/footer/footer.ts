import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  template: `
    <footer class="bg-stone-100 border-t border-stone-200 pt-12 pb-24 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <img src="assets/logo-sans-fond.png" alt="Logo Univers des Âmes" class="h-24 w-auto object-contain">
            <h3 class="font-serif text-xl text-spirit-primary italic">L'Univers des Âmes</h3>
          </div>
          <p class="text-sm text-gray-500 leading-relaxed">
            Éveillez votre spiritualité avec nos créations artisanales et nos soins énergétiques.
          </p>
        </div>

        <!-- Social -->
        <div class="space-y-4">
          <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wider">Suivez-nous</h4>
          <div class="flex gap-4">
            <a href="https://www.instagram.com/universdesames" target="_blank"
               class="h-10 w-10 rounded-full bg-white flex items-center justify-center text-spirit-primary shadow-sm hover:bg-spirit-primary hover:text-white transition-all">
              <img src="assets/images/instagram.png" alt="logo instagram"/>
            </a>
            <a href="https://www.tiktok.com/@universdesames" target="_blank"
               class="h-10 w-10 rounded-full bg-white flex items-center justify-center text-spirit-primary shadow-sm hover:bg-spirit-primary hover:text-white transition-all">
              <img src="assets/images/tik-tok.png" alt="logo tiktok"/>
            </a>
          </div>
        </div>

        <!-- Legal -->
        <div class="space-y-4">
          <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wider">Informations</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a routerLink="/mentions-legales" class="hover:text-spirit-primary transition-colors">Mentions
              Légales</a></li>
            <li><a routerLink="/cgv" class="hover:text-spirit-primary transition-colors">CGV</a></li>
            <li><a routerLink="/contact" class="hover:text-spirit-primary transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-stone-200 text-center text-xs text-gray-400">
        &copy; {{ currentYear }} L'Univers des Âmes. Tous droits réservés.
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
