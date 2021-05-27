import { Address } from './address';

export function parseAddress(query: string): Address {
  const shortPattern = /^(\w+)\s(\d+)$/;
  const longPattern = /^(\w+)\s(\d+),\s(\d+)\s(\w+)$/;

  if (query.match(shortPattern)) {
    const [, street, streetNumber] = query.match(shortPattern);
    return { street, streetNumber };
  } else if (query.match(longPattern)) {
    const [, street, streetNumber, zip, city] = query.match(longPattern);
    return { street, streetNumber, zip, city };
  }
  return { street: '', streetNumber: '' };
}
