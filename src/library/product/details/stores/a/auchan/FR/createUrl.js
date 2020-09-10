
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'auchan.fr',
    prefix: null,
    url: 'https://www.auchan.fr/products/p-{id}',
    country: 'FR',
    store: 'auchan',
    zipcode: '',
  },
};
