import { Products_3 } from '../graphql-types';
import { Product } from '../models';

function descriptionLegible(p: Products_3) {
  if (p.licensesMax === 1) {
    return `1 user`;
  } else if (p.licensesMin === p.licensesMax) {
    return `${p.licensesMin} users`;
  } else {
    return `${p.licensesMin}-${p.licensesMax} users`;
  }
}

export function productFromProduct_3(p: Products_3): Product {
  return {
    id: p.id,
    name: p.name,
    description: descriptionLegible(p),
    licensesMin: p.licensesMin,
    licensesMax: p.licensesMax,
    pricereg: p.pricereg,
    pricesale: p.pricesale
  };
}
