
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'bilka.dk',
    prefix: 'produkter',
    suffix: 'id',
    url: 'https://www.bilka.dk/produkter/{id}/',
    country: 'DK',
    store: 'bilka',
    zipcode: '',
  },
};
