import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {

  private loader$ = new BehaviorSubject<boolean>(true);
  public loaderObs = this.loader$.asObservable();

  actualizarValorLoader(valor:boolean){
    this.loader$.next(valor);
  }

  constructor(){ }
}
