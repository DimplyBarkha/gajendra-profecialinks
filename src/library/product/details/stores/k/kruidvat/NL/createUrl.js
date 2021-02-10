
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'kruidvat.nl',
    prefix: null,
    // url: 'https://www.kruidvat.nl/search?q={id}',
    url: 'https://www.kruidvat.nl/p/{id}',
    country: 'NL',
    store: 'kruidvat',
    zipcode: '',
  },
};
