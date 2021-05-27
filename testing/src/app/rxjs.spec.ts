import { combineLatest, Observable } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { exhaustMap, filter, first, map } from 'rxjs/operators';

describe('', () => {
  test(
    'multiply by 2',
    marbles((m) => {
      const source = m.cold('--a-b-c', { a: 2, b: 10, c: 25 });

      const destination = source.pipe(map((n) => n * 2));

      m.expect(destination).toBeObservable('--x-y-z', {
        x: 4,
        y: 20,
        z: 50
      });
    })
  );

  test(
    'unsubscription',
    marbles((m) => {
      const source = m.cold('abcde', {
        a: 'Hauptstraße 3',
        b: '',
        c: 'Domgasse 5',
        d: 'Kärntnerring 12',
        e: 'Praterstern 2'
      });

      const destination = source.pipe(
        filter((address) => address === 'Domgasse 5'),
        first()
      );

      m.expect(destination).toBeObservable('--(a|)', { a: 'Domgasse 5' });
    })
  );

  it(
    'should test combineLatest',
    marbles((m) => {
      const s1 = m.cold('-a', { a: 1 });
      const s2 = m.cold('a-', { a: 2 });

      const destination = combineLatest([s1, s2]).pipe(map(([a1, a2]) => a1 + a2));

      m.expect(destination).toBeObservable('-s', { s: 3 });
    })
  );

  it(
    'should test high order observable',
    marbles((m) => {
      const source: Observable<string> = m.cold('pd', { p: 'Praterstern', d: 'Domgasse 5' });
      const dest: Observable<boolean> = source.pipe(
        exhaustMap((query) => m.cold('---b', { b: query === 'Domgasse 5' }))
      );

      m.expect(dest).toBeObservable('---f-', { f: false, t: true });
    })
  );
});
