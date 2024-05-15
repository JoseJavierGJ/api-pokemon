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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { FormsModule } from '@angular/forms';
// import { MatSort, MatSortModule } from '@angular/material/sort'; //
import { ChangeDetectorRef } from '@angular/core';



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
    LoaderComponent, FormsModule],
})


export class InicioComponent implements OnInit{
  
  displayedColumns: string[] = ['image', 'position', 'name', 'url', 'remove'];
  dataSource: Pokemon[] = [];
  allPokemons: Pokemon[] = [];
  availablePokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null; 
  loader:boolean = false;
  pokemonToDelete: Pokemon | null = null;
  showConfirmationDialog: boolean = false;
  newPokemonName: string = '';
  newPokemonUrl: string = '';


  constructor(private obtenerDatosService: ObtenerDatosService, 
    private observablesService: ObservablesService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef ) { }


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
            // Extraer el ID del pokemon de la URL
            const urlParts = pokemon.url.split('/');
            const pokemonId = parseInt(urlParts[urlParts.length - 2]); 
            return {
              position: pokemonId,
              name: pokemon.name,
              // Imagen gif
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`,
              // Imagen png
              // imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
              url: pokemon.url
            };
          });
        }
      },
    );
  }
  

  loadAllPokemons(): void {
    this.obtenerDatosService.getPokemon('https://pokeapi.co/api/v2/pokemon?limit=151').subscribe(
      (response: any) => {
        this.allPokemons = response.results.map((pokemon: any, index: number) => ({
          position: index + 1,
          name: pokemon.name,
          url: pokemon.url, 
          // Imagen gif
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${parseInt(pokemon.url.split('/')[6])}.gif`
          // Imagen png
          // imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(pokemon.url.split('/')[6])}.png`
        }));
        console.log(this.allPokemons); 
        this.updateAvailablePokemons();
      }
    );
  }


  updateAvailablePokemons(): void {
    this.availablePokemons = this.allPokemons.filter(ap => !this.dataSource.some(dp => dp.name === ap.name));
    this.availablePokemons.forEach(pokemon => {
      const urlParts = pokemon.url.split('/');
      // const pokemonId = parseInt(urlParts[urlParts.length - 2]);
      pokemon.imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${parseInt(pokemon.url.split('/')[6])}.gif`;
    });
  }

  
  addPokemon(): void {
    if (this.selectedPokemon) {
      // Verificar si el pokemon ya está en la tabla
      const pokemonExists = this.dataSource.some(pokemon => pokemon.name === this.selectedPokemon!.name);
      
      if (pokemonExists) {
        // Si el pokemon ya está en la tabla mostrar una alerta
        alert("¡Este Pokémon ya está en la tabla!");
      } else {
        // Si el Pokemon no está en la tabla lo agrega
        this.dataSource = [...this.dataSource, this.selectedPokemon];
        this.selectedPokemon = null; // Reseteamos despues de añadir
        this.updateAvailablePokemons();
      }
    }
  }


  removeData(pokemonToRemove: Pokemon): void {
    const dialogRef = this.dialog.open(
      DeleteDialogComponent,
      {
        data: { fileName: pokemonToRemove.name },
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource = this.dataSource.filter(
          (pokemon) => pokemon !== pokemonToRemove
        );
      }
    });
  }


  addNewPokemon(): void {

    if (this.newPokemonName.trim() === '' || this.newPokemonUrl.trim() === '') {
      alert('Por favor, completa todos los campos para agregar un nuevo Pokémon.');
      return;
    }
    
    const newPosition = this.dataSource.length + 1;
    // arreglo imagenes 
    const availableImages = [
      // 'assets/images/img/missingno.png',
      'assets/images/img/parrot.png',
      // 'assets/images/img/cat0.png',
      'assets/images/img/cat1.png',
      // 'assets/images/img/cat2.png',
      'assets/images/img/cat3.png',
      // 'assets/images/img/cat4.png',
      'assets/images/img/cat5.png',
      'assets/images/img/cat6.gif',
      'assets/images/img/cat7.gif',
      'assets/images/img/cat8.gif'
    ];
  
    // selecciona una imagen aleatoria
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const randomImage = availableImages[randomIndex];
  
    // nuevo pokemon con imagen aleatoria
    const newPokemon: Pokemon = {
      name: this.newPokemonName,
      position: newPosition,
      imageUrl: randomImage, 
      url: this.newPokemonUrl
    };
  
    // agrega el nuevo pkemon al dataSource y actualiza la vista
    this.dataSource = [...this.dataSource, newPokemon];
    this.newPokemonName = '';
    this.newPokemonUrl = '';
    this.updateAvailablePokemons();
    this.cdr.detectChanges();
  }
}


