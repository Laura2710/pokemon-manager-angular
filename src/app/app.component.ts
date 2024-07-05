import {Component} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {PokemonsComponent} from './composants/pokemons/pokemons.component';
import {GenerationsComponent} from './composants/generations/generations.component';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true, // composant autonome appelé dans main.ts
  imports: [RouterOutlet, RouterModule, PokemonsComponent, GenerationsComponent, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pokemonManager';
}
