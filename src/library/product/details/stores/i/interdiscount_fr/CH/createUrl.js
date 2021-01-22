
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'interdiscount.ch',
    // prefix: 'de',
    url: 'https://www.interdiscount.ch/fr/--p{id}',
    country: 'CH',
    store: 'interdiscount_fr',
    zipcode: '',
  },
};
