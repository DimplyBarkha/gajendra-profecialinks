
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'k-ruoka.fi',
    prefix: null,
    url: 'https://www.k-ruoka.fi/kauppa/tuote/{searchTerm}',
    country: 'FI',
    store: 'k-ruoka',
    zipcode: '',
  },
};
