import { fakeAsync, flushMicrotasks, tick, waitForAsync } from '@angular/core/testing';

describe('Asynchronicity', () => {
  test('time', (done) => {
    let a = 1;
    window.setTimeout(() => {
      a++;
      expect(a).toBe(2);
      done();
    });
  });

  it('should bend time', fakeAsync(() => {
    let a = 1;
    Promise.resolve().then(() => a++);
    window.setTimeout(() => a++, 0);
    flushMicrotasks();
    expect(a).toBe(2);

    tick();
    expect(a).toBe(3);
  }));

  it(
    'should resolve with waitForAsync',
    waitForAsync(() => {
      let a = 1;
      Promise.resolve().then(() => {
        a++;
        expect(a).toBe(2);
      });
      expect(a).toBe(1);
    })
  );
});
