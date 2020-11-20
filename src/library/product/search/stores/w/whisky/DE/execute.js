
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    domain: 'whisky.de',
    url: 'https://www.lyreco.com/webshop/FRFR/search',
    loadedSelector:'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
