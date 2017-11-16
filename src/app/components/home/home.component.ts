import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  pokeman_API_URL: string= "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0";
  pokemons: any[];
  loadingPokemons: boolean = false;
  message: string;
  fetchMsg: string;
  pokemonsData: any[] = [];
  pokemonDetails;
  abilitiesData: any[] = [];
  showButtons: boolean = false;
  navigation;
  previousURL: string;
  nextURL: string;
  disablePrevious: boolean = false;
  disableNext: boolean = false;
  pageNumber: number;
  abilitiesDetails;
  showHeadings: boolean = false;
  modalFetchMsg: boolean = false;
  disableModalButton: boolean;

  constructor(private _pokemonService: PokemonService, 
              private _http:Http,
              private _modalService: NgbModal,
              public activeModal: NgbActiveModal ) { }

  ngOnInit() {
     // this.getPokemons(); // get url from service---------------------------------------------------------------------
  }

  getPokemons() {
    this.loadingPokemons=true;
    this.fetchMsg = "Fetching Pokemons...";
    setTimeout(() => {
      this.fetchMsg = "Fetching pokemons is taking longer than expected..."
    }, 3000);
    return this._http.get(this.pokeman_API_URL).map(res => res.json()).subscribe(
      data => this.handlePokemons(data),
      error => {
        this.message = "Encountered an error. Please reload the page.";
        this.loadingPokemons= false;
        console.log(error);
      }
    )
  }

  handlePokemons(data) {
    console.log(data);
    this.navigation = data;
    console.log(this.navigation.previous);
    this.pokemons = data.results;
    console.log(this.pokemons);
    this.getPokemonsData();
  }

  getPokemonsData() {
    this.pokemons.map((pokemon) => {
      return this._http.get(pokemon.url).map(res => res.json()).subscribe(
         data => {
          console.log(data);
          this.pokemonsData.push(data);
         },
         error => {
           this.message = "Encountered an error. Please reload the page.";
           console.log(error);
         },
         () => {
          this.loadingPokemons= false;
          this.message = "Click on pokemon to view more details";
          setTimeout(() => {
            this.showButtons= true;
          }, 3000);
          this.checkButtons();
         }
       )
    })
  }

  openModal(pokemon:any, modal) {
    this.pokemonDetails = pokemon;
    this._modalService.open(modal);
    this.abilitiesData = [];
    this.showHeadings = false;
    this.disableModalButton = false;
  }

  checkButtons() {
    if(!this.navigation.previous) {
      this.disablePrevious = true;
    } else {
      this.disablePrevious = false;
    }

    if(!this.navigation.next) {
      this.disableNext = true;
    } else {
      this.disableNext = false;
    }
  }

  previousPage() {
   this.pokeman_API_URL = this.navigation.previous; 
   this.pokemonsData = [];
   this.getPokemons();
   this.checkButtons();
  }

  nextPage() {
    this.pokeman_API_URL = this.navigation.next; 
    this.pokemonsData = [];
    this.getPokemons();
    this.checkButtons();
  }

  getAbilities() {
    this.modalFetchMsg = true;
    this.disableModalButton = true;
    this.abilitiesDetails = this.pokemonDetails.abilities;
    console.log(this.abilitiesDetails);
    this.abilitiesDetails.map((abilityDetail) => {
         console.log(abilityDetail.ability.url);
         return this._http.get(abilityDetail.ability.url).map(res => res.json()).subscribe(
          data => {
               console.log(data);
               this.abilitiesData.push(data);
              },
          error => {
            this.message = "Encountered an error. Please reload the page.";
            console.log(error);
              },
              () => {
                this.modalFetchMsg = false;
                this.showHeadings = true;
              }
        )
   })
  }
}
