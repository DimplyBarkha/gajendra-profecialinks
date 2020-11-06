
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'carrefour.fr',
    prefix: null,
    url: 'https://www.carrefour.fr/s?q={id}',
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
};
