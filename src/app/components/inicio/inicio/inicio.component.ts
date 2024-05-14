import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { ObtenerDatosService } from '../../../services/obtener-datos.service';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ObservablesService } from '../../../services/observables.service';
import { LoaderComponent } from '../../loader/loader.component';
// import { MatSort, MatSortModule } from '@angular/material/sort'; //


export interface Pokemon {
  name: string;
  position: number;
  imageUrl: string;
  url: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  imports: [RouterLink, MatButtonModule, MatIconModule, CommonModule, 
    MatTableModule, MatInputModule, MatSelectModule, MatFormFieldModule, 
    LoaderComponent],
})


export class InicioComponent implements OnInit{
  
  displayedColumns: string[] = ['image', 'position', 'name', 'url', 'remove'];
  dataSource: Pokemon[] = [];
  allPokemons: Pokemon[] = [];
  availablePokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null; 
  loader:boolean = false;


  constructor(private obtenerDatosService: ObtenerDatosService, 
    private observablesService: ObservablesService) { }

  ngOnInit(): void {
    this.loadAllPokemons();
    this.getPokemon();
    this.observablesService.loaderObs.subscribe((valor:any) => {
      this.loader = valor;
    });
  }

  getPokemon(): void {
    this.obtenerDatosService.getPokemon('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0').subscribe(
      (response: any) => {
        setTimeout(() => this.observablesService.actualizarValorLoader(false),2000);
        console.log("Response from API:", response);
        if (response.results) {
          this.dataSource = response.results.map((pokemon: any) => {
            // Extraer el ID del Pokémon de la URL
            const urlParts = pokemon.url.split('/');
            const pokemonId = parseInt(urlParts[urlParts.length - 2]); 
            return {
              position: pokemonId,
              name: pokemon.name,
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
              url: pokemon.url
            };
          });
        } else {
          console.error("Unexpected API response structure:", response);
        }
      },
      error => {
        console.error("Error fetching Pokémon:", error);
      }
    );
  }

  loadAllPokemons(): void {
    this.obtenerDatosService.getPokemon('https://pokeapi.co/api/v2/pokemon?limit=151').subscribe(
      (response: any) => {
        this.allPokemons = response.results.map((pokemon: any, index: number) => ({
          position: index + 1,
          name: pokemon.name,
          url: pokemon.url, // Asegúrate de que esta línea está asignando la URL correctamente
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(pokemon.url.split('/')[6])}.png`
        }));
        console.log(this.allPokemons); // Agrega esto para verificar las URLs
        this.updateAvailablePokemons();
      }
    );
  }

  updateAvailablePokemons(): void {
    this.availablePokemons = this.allPokemons.filter(ap => !this.dataSource.some(dp => dp.name === ap.name));
    this.availablePokemons.forEach(pokemon => {
      const urlParts = pokemon.url.split('/');
      const pokemonId = parseInt(urlParts[urlParts.length - 2]);
      pokemon.imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    });
  }
  
  addPokemon(): void {
    if (this.selectedPokemon) {
      // Verificar si el Pokémon ya está en la tabla
      const pokemonExists = this.dataSource.some(pokemon => pokemon.name === this.selectedPokemon!.name);
      
      if (pokemonExists) {
        // Si el Pokemon ya está en la tabla mostrar una alerta
        alert("¡Este Pokémon ya está en la tabla!");
      } else {
        // Si el Pokemon no está en la tabla, agregarlo
        this.dataSource = [...this.dataSource, this.selectedPokemon];
        this.selectedPokemon = null; // Reseteamos después de añadir
        this.updateAvailablePokemons();
      }
    }
  }

  removeData(pokemonToRemove: Pokemon): void {
    this.dataSource = this.dataSource.filter(pokemon => pokemon !== pokemonToRemove);
  }
}




