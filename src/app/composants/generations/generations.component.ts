import {CommonModule} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {PokemonService} from '../../services/pokemon.service';
import {RouterLink} from "@angular/router";
import {map, Observable} from "rxjs";
import {Generation} from "../../models/Generation";

@Component({
  selector: 'app-generations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './generations.component.html',
  styleUrl: './generations.component.css'
})
export class GenerationsComponent implements OnInit {
  generations$: Observable<Generation[]> | undefined;


  constructor(@Inject(PokemonService) private pokemonService: PokemonService) {
  }

  ngOnInit(): void {

  }

  obtenirGenerationsPokemon() {
    this.generations$ = this.pokemonService.chargerGenerations().pipe(
      map((data: any) => data.results))
  }

}
