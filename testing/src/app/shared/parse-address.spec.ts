import { parseAddress } from './parse-address';

describe('parser', () => {
  it('should provide a parse method', () => {
    const address = parseAddress('Domgasse 5');
    expect(address).toEqual({ street: 'Domgasse', streetNumber: '5' });
  });

  it('should parse a German address format with city and zip', () => {
    const address = parseAddress('Domgasse 5, 1010 Wien');
    expect(address).toEqual({
      street: 'Domgasse',
      streetNumber: '5',
      city: 'Wien',
      zip: '1010'
    });
  });
});
