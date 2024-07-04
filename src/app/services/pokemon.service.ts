import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, mergeMap, Observable, zip} from "rxjs";
import {Pokemon} from "../models/Pokemon";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(private http: HttpClient) {
  }

  /**
   * Charge la liste des générations
   * @returns Observable avec les données des générations
   */
  chargerGenerations() {
    return this.http.get("https://pokeapi.co/api/v2/generation/");
  }

  /**
   * Charge les détails d'une génération spécifique
   * @param url URL de l'API pour obtenir les détails d'une génération
   * @returns Observable avec les détails de la génération
   */
  chargerDetailsGeneration(url: string) {
    return this.http.get(url);
  }

  /**
   * Méthode pour obtenir la liste des Pokémonss
   * @returns Observable avec la liste des Pokémons
   */
  obtenirListePokemons(): Observable<any> {
    return this.http.get("https://pokeapi.co/api/v2/pokemon");
  }

  /**
   * Méthode pour obtenir les détails et les catégories des Pokémons
   * @param pokemons Liste des Pokémons
   * @returns Observable avec les détails des Pokémonss
   */
  obtenirDetailsDesPokemons(pokemons: object[]): Observable<Pokemon[]> {
    const requetes = pokemons.map((pokemon: object) =>
      this._obtenirDetail(pokemon).pipe(
        mergeMap((details: object) =>
          this._obtenirCategories(details).pipe(
            map((categorie: object) => this.formatterDetailsPokemon(details, categorie))
          )
        )
      )
    );

    return zip(requetes);
  }

  _obtenirDetail(pokemon: any): Observable<any> {
    return this.http.get(pokemon.url);
  }

  _obtenirCategories(pokemon: any): Observable<object> {
    return this.http.get(pokemon.species.url);
  }

  /**
   * Méthode pour obtenir les détails des Pokémonss par générations
   * @param pokemons Liste des Pokémonss
   * @returns Observable avec les détails des Pokémons par génération
   */
  obtenirDetailsDesPokemonsParGeneration(pokemons: any[]): Observable<Pokemon[]> {
    const requetesParGeneration = pokemons.map(pokemon =>
      this.http.get(pokemon.url).pipe(
        mergeMap((details: any) => {
          const idPokemon = details.id;
          const urlDetailsPokemon = `https://pokeapi.co/api/v2/pokemon/${idPokemon}`;
          return this.http.get(urlDetailsPokemon).pipe(
            mergeMap((detailsComplete: any) =>
              this.http.get(detailsComplete.species.url).pipe(
                map((categorie: any) => this.formatterDetailsPokemon(detailsComplete, categorie))
              )
            )
          );
        })
      )
    );
    return forkJoin(requetesParGeneration);
  }

  /**
   * Méthode pour obtenir la liste des Pokémonss
   * @returns Observable avec la liste des Pokémons
   */
  obtenirListePokemonsParNom(nom: string): Observable<Pokemon> {
    return this.http.get<any>("https://pokeapi.co/api/v2/pokemon?limit=1000").pipe(
      map((response: any) => {
        return response.results.filter((pokemon: any) => pokemon.name.startsWith(nom.toLowerCase()));
      })
    );
  }

  /**
   * Formate les détails d'un Pokémonss avec ses catégories
   * @param details Détails du Pokémons
   * @param detailsCategorie Détails de la catégorie du Pokémons
   * @returns Objet formaté contenant les détails du Pokémons
   */
  private formatterDetailsPokemon(details: any, detailsCategorie: any): Pokemon {
    return {
      id: details.id,
      nom: details.name.toUpperCase(),
      categorie: detailsCategorie.genera.find((genus: any) => genus.language.name === 'en').genus,
      type: details.types.map((t: any) => t.type.name).join(', '),
      taille: details.height / 10,
      poids: details.weight / 10,
      image: details.sprites.front_shiny,
      url: details.url
    };
  }

}
