import { Component, OnInit } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObservablesService } from '../../services/observables.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})

export class LoaderComponent implements OnInit{
  loader:boolean = false; 
  constructor(private observablesService:ObservablesService){

  }

  ngOnInit(): void {
    this.observablesService.loaderObs.subscribe((valor:boolean) => {
      this.loader = valor;
    });
  }
}