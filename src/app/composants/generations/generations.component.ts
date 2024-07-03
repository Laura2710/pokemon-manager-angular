import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-generations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './generations.component.html',
  styleUrl: './generations.component.css'
})
export class GenerationsComponent implements OnInit {
  generations: any[] = [];


  constructor(@Inject(PokemonService) private pokemonService: PokemonService) {}

   ngOnInit(): void {
    this.obtenirGenerationsPokemon();
  }

  obtenirGenerationsPokemon() {
    this.pokemonService.chargerGenerations().subscribe((data:any) => {
    this.generations = data.results;
   })
  }

}
