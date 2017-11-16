import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'; 


@Injectable()
export class PokemonService {

  private pokeman_API_URL: string = "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0";

  constructor(private _http: Http) { }

  getPokemons() {
    return this._http.get(this.pokeman_API_URL).map(res => res.json())
  } 

}
