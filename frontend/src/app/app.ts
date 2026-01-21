import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './core/layout/header/header';
import {BottomNavComponent} from './core/layout/bottom-nav/bottom-nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
