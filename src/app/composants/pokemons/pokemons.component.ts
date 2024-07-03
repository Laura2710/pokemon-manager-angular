import { CommonModule } from '@angular/common';
import {Component, Inject, OnInit, signal} from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})
export class PokemonsComponent implements OnInit {
  tousLesPokemons: any[] = [];// Tableau contenant tous les Pokémons
  pokemonsAffiches: any[] = [];// Tableau contenant les Pokémons à afficher sur la page actuelle
  nombreTotalDePokemons: number = 0;  // Nombre total de Pokémons
  generationSelectionnee: string | null = '';  // Génération de Pokémons sélectionnée
  nombreDePokemonParPage: number = 20;  // Nombre de Pokémons par page
  nombreTotalDePages: number = 0;  // Nombre total de pages
  numerosDePage: number[] = [];  // Tableau contenant les numéros de page
  pageActuelle: number = 1; // Page actuelle
  enChargement= signal(true);// Variable pour suivre l'état de chargement

  constructor(@Inject(PokemonService) private pokemonService: PokemonService, private route: ActivatedRoute) { }

  // Avant que le composant soit affiché
  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.generationSelectionnee = param.get("generation");
      if (this.generationSelectionnee !== null) {
        this.obtenirPokemonParGeneration(`https://pokeapi.co/api/v2/generation/${this.generationSelectionnee}`);
      } else {
        this.obtenirTousLesPokemons();
      }
    });
  }

  /**
   * Obtient les Pokémons d'une génération spécifique
   * @param url URL de l'API pour obtenir les Pokémon de la génération
   */
  obtenirPokemonParGeneration(url: string) {
    this.enChargement.set(true) // debut du chargement
    this.pokemonService.chargerDetailsGeneration(url).subscribe((data: any) => {
      const pokemons = data.pokemon_species;
      this.pokemonService.obtenirDetailsDesPokemonsParGeneration(pokemons).subscribe((detailedPokemons: any[]) => {
        this.tousLesPokemons = detailedPokemons;
        this.nombreTotalDePokemons = this.tousLesPokemons.length;
        this.calculerPages();
        this.mettreAJourPokemonsAffiches();
        this.enChargement.set(false) // chargement terminé
      });
    });
  }

  /**
   * Obtient tous les Pokémons
   */
  obtenirTousLesPokemons() {
    this.enChargement.set(true); // début du chargement

    this.pokemonService.obtenirListePokemons().subscribe({
      next: (data: any) => {
        this.pokemonService.obtenirDetailsDesPokemons(data.results).subscribe({
          next: (detailedPokemons: any[]) => {
            this.tousLesPokemons = detailedPokemons;
            this.nombreTotalDePokemons = this.tousLesPokemons.length;
            this.calculerPages();
            this.mettreAJourPokemonsAffiches();
            this.enChargement.set(false); // chargement terminé
          },
          error: (err) => {
            console.error('Erreur lors de l\'obtention des détails des Pokémons', err);
            this.enChargement.set(false); // chargement terminé même en cas d'erreur
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'obtention de la liste des Pokémons', err);
        this.enChargement.set(false); // chargement terminé même en cas d'erreur
      }
    });
  }


  /**
   * Formate un nombre en utilisant la notation française
   * @param valeur Nombre à formater
   * @returns Nombre formaté en chaîne de caractères
   */
  formaterNombreFR(valeur: number | null | undefined): string {
    return valeur != null ? valeur.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : 'N/A';
  }

  /**
   * Calcule le nombre total de pages et initialise le tableau des numéros de page
   */
  calculerPages(): void {
    this.nombreTotalDePages = Math.ceil(this.tousLesPokemons.length / this.nombreDePokemonParPage);
    this.numerosDePage = Array.from({ length: this.nombreTotalDePages }, (_, i) => i + 1);
  }

  /**
   * Définit la page actuelle et met à jour les Pokémon affichés
   * @param page Numéro de la page à afficher
   */
  definirPage(page: number): void {
    this.pageActuelle = page;
    this.mettreAJourPokemonsAffiches();
  }

  /**
   * Change la page actuelle et met à jour les Pokémons affichés
   * @param i Numéro de la page suivante
   */
  pageSuivante(i: number) {
    this.definirPage(i);
  }

  /**
   * Met à jour les Pokémons affichés en fonction de la page actuelle
   */
  mettreAJourPokemonsAffiches() {
    const indexDebut = (this.pageActuelle - 1) * this.nombreDePokemonParPage;
    const indexFin = indexDebut + this.nombreDePokemonParPage;
    this.pokemonsAffiches = this.tousLesPokemons.slice(indexDebut, indexFin);
  }
}
