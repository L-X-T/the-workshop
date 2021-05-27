import { HttpClient, HttpParams } from '@angular/common/http';
import { fromPairs } from 'lodash';
import { asyncScheduler, Observable, scheduled } from 'rxjs';
import { AddressLookuper } from './address-lookuper.service';

describe('AddressLookupService', () => {
  it('should sanity check', () => {
    const lookuper = new AddressLookuper(null);
    expect(lookuper).toBeDefined();
  });

  it('should throw an error if no street number is given', () => {
    const lookuper = new AddressLookuper(null);

    expect(() => lookuper.lookup('Domgasse')).toThrow('Address without street number');
  });

  it.each<any>([
    ['Domgasse 5, 1010 Wien', [], false],
    ['Domgasse 15, 1010 Wien', [1], true]
  ])(
    'should require an addressSupplier as Observable:  %s',
    (query: string, result: any, expected: boolean, done: jest.DoneCallback) => {
      const http = { get: () => scheduled([result], asyncScheduler) };

      const lookuper = new AddressLookuper((http as unknown) as HttpClient);
      lookuper.lookup(query).subscribe((result) => {
        expect(result).toBe(expected);
        done();
      });
    }
  );

  it('should verify that httpClient get is called', (done) => {
    const http = { get: () => scheduled([['Domgasse 15, 1010 Wien']], asyncScheduler) };
    const lookuper = new AddressLookuper((http as unknown) as HttpClient);

    lookuper.lookup('Domgasse 15').subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should call nominatim with the right parameters', () => {
    const get = jest.fn<Observable<string[]>, [string, { params: HttpParams }]>(() =>
      scheduled([[]], asyncScheduler)
    );
    const lookuper = new AddressLookuper(({ get } as unknown) as HttpClient);

    lookuper.lookup('Domgasse 5');

    const [url, { params }] = get.mock.calls[0];
    expect(url).toBe('https://nominatim.openstreetmap.org/search.php');
    const paramsMap = fromPairs(params.keys().map((key) => [key, params.get(key)]));
    expect(paramsMap).toMatchObject({
      format: 'jsonv2',
      q: 'Domgasse 5'
    });
  });
});
