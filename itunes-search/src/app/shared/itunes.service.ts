import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

const API = {
  SEARCH: 'https://itunes.apple.com/search?',
  LOOKUP: 'https://itunes.apple.com/lookup?'
}

@Injectable()
export class ItunesService {

  constructor(private jsonp: Jsonp) {
  }

  public search(searchTerm): Promise {
    return this.jsonp.get(`${API.SEARCH}callback=JSONP_CALLBACK&media=music&country=US&entity=musicArtist&term=${searchTerm}`)
      .toPromise()
      .then(data => data.json().results)
      .catch(this.handleError)
  }

  private handleError(error: any): Promise {
    console.log(error);
    return Promise.reject(error.message || error);
  }
}