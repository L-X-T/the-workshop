import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseAddress } from './parse-address';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  constructor(private httpClient: HttpClient) {}

  lookup(query: string): Observable<boolean> {
    const address = parseAddress(query);
    if (!address.streetNumber) {
      throw new Error('Address without street number');
    }

    return this.httpClient
      .get<string[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query)
      })
      .pipe(map((addresses) => addresses.length > 0));
  }
}
