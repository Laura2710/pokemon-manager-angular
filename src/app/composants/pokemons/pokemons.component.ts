import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute } from "@angular/router";
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { Observable, of, switchMap, tap } from "rxjs";
import { Pokemon } from "../../models/Pokemon";

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})
export class PokemonsComponent implements OnInit {
  private _tousLesPokemons: Pokemon[] = [];
  private _pokemonsAffiches: Pokemon[] = [];
  private _nombreTotalDePokemons: number = 0;
  private _generationSelectionnee: string | null = '';
  private readonly _nombreDePokemonParPage: number = 20;
  private _nombreTotalDePages: number = 0;
  private _numerosDePage: number[] = [];
  private _pageActuelle: number = 1;
  private _dataLoadedSearch: boolean = false;
  private _tousLesPokemonsBis$: Observable<Pokemon[]> | undefined;

  constructor(@Inject(PokemonService) private pokemonService: PokemonService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this._generationSelectionnee = param.get("generation");
      if (!this._dataLoadedSearch) {
        this._generationSelectionnee ?
          this.obtenirPokemonParGeneration(`https://pokeapi.co/api/v2/generation/${this._generationSelectionnee}`) :
          this.obtenirTousLesPokemons();
      }
    });
  }
  get tousLesPokemons(): Pokemon[] {
    return this._tousLesPokemons;
  }

  get pokemonsAffiches(): Pokemon[] {
    return this._pokemonsAffiches;
  }

  get nombreTotalDePokemons(): number {
    return this._nombreTotalDePokemons;
  }

  get numerosDePage(): number[] {
    return this._numerosDePage;
  }

  get tousLesPokemonsBis$(): Observable<Pokemon[]> {
    return this._tousLesPokemonsBis$ || of([]);
  }


  private obtenirPokemonParGeneration(url: string) {
    this._tousLesPokemonsBis$ = this.pokemonService.chargerDetailsGeneration(url).pipe(
      switchMap((pokemons: any) => this.pokemonService.obtenirDetailsDesPokemonsParGeneration(pokemons.pokemon_species).pipe(
        tap(detailedPokemons => this.traitement(detailedPokemons))
      ))
    );
  }

  private obtenirTousLesPokemons() {
    this._tousLesPokemonsBis$ = this.pokemonService.obtenirListePokemons().pipe(
      switchMap(pokemons => this.pokemonService.obtenirDetailsDesPokemons(pokemons.results).pipe(
        tap(detailedPokemons => this.traitement(detailedPokemons))
      ))
    );
  }

  formaterNombreFR(valeur: number | null | undefined): string {
    return valeur != null ? valeur.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : 'N/A';
  }

  private calculerPages(): void {
    this._nombreTotalDePages = Math.ceil(this.nombreTotalDePokemons / this._nombreDePokemonParPage);
    this._numerosDePage = Array.from({ length: this._nombreTotalDePages}, (_, i) => i + 1);
  }

  definirPage(page: number): void {
    this._pageActuelle = page;
    this.mettreAJourPokemonsAffiches();
  }

  pageSuivante(i: number) {
    this.definirPage(i);
  }

  private mettreAJourPokemonsAffiches() {
    const indexDebut = (this._pageActuelle - 1) * this._nombreDePokemonParPage;
    const indexFin = indexDebut + this._nombreDePokemonParPage;
    this._pokemonsAffiches = this.tousLesPokemons.slice(indexDebut, indexFin);
  }

  onPokemonDataReceived(data: any) {
    this._tousLesPokemonsBis$ = this.pokemonService.obtenirDetailsDesPokemons(data).pipe(
      switchMap(detailedPokemons => {
        this.traitement(detailedPokemons);
        this._dataLoadedSearch = true;
        return of(detailedPokemons);
      })
    );
  }

  private traitement(detailedPokemons: any) {
    this._nombreTotalDePokemons = detailedPokemons.length;
    this._tousLesPokemons = detailedPokemons;
    this.calculerPages();
    this.mettreAJourPokemonsAffiches();
  }
}
