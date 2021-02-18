
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'Buybuybaby',
    domain: 'buybuybaby.com',
    url: "https://www.buybuybaby.com/store/s/{searchTerms}?ta=typeahead",
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
