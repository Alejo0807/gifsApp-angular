import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private url: string = 'https://api.giphy.com/v1/gifs/search?';
  private apiKey: string = 'fxDvSlyyRLxpAXlOWpjgoqJGVmfi9fE1';
  private _historic: string[] = [];

  public results: Gif[] = [];

  get historic() {
    return[...this._historic];
  }
  
  constructor(private http: HttpClient) {

    // if (localStorage.getItem('historial')) {
  
    //   this._historic = JSON.parse(localStorage.getItem('historial')!);
    // }
    this._historic = JSON.parse(localStorage.getItem('historial')!) || [];
    this.results = JSON.parse(localStorage.getItem('resultados')!) || [];
    
  }

  searchGifs( query:string ) {

    query = query.trim().toLocaleLowerCase();

    // Validations 
    if (this._historic.includes(query)) {
      this._historic = this._historic.filter( (value) => {
        return value !== query
      });
    }

    if (this._historic.length === 10) {
      this._historic.pop();
    }
    // End Validations


    this._historic.unshift(query);
    // Save in Local Storage
    localStorage.setItem('historial', JSON.stringify(this._historic));

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    const final_url = `${this.url}${params.toString()}`;
    
    this.http.get<SearchGifsResponse>(final_url)
      .subscribe( (resp) => {
        // console.log(resp.data)
        this.results = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.results));
    })
    

    // console.log(data_r);
  }
}
