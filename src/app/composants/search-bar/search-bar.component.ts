import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PokemonService} from "../../services/pokemon.service";

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  namePokemon = '';
  @Output() pokemonData: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(PokemonService) private pokemonsService: PokemonService) {
  }

  searchPokemon() {
    this.pokemonsService.obtenirListePokemonsParNom(this.namePokemon).subscribe({
        next: (data) => {
          this.pokemonData.emit(data)
        }
      }
    )
  }
}
