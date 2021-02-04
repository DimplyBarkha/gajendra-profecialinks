
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'carrefouruae.com',
    prefix: null,
    // url: 'https://www.carrefouruae.com/p/{id}',
    url: 'https://www.carrefouruae.com/v4/search?keyword={id}',
    country: 'AE',
    store: 'carrefour',
    zipcode: '',
  },
};
