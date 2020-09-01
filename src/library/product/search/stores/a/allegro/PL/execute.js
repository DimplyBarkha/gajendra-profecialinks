
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    domain: 'allegro.pl',
    url: 'https://allegro.pl/listing?string={searchTerms}',
    loadedSelector: 'div.opbox-listing-layout',
    noResultsXPath: null,
    zipcode: '',
  },
};
