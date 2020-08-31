
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bedbathandbeyond',
    domain: 'bedbathandbeyond.com',
    url: 'https://www.bedbathandbeyond.ca/store/s/{searchTerms}?ta=typeahead',
    loadedSelector: 'section.productSearch div.grid-container .tealium-product-grid',
    noResultsXPath: null,
    zipcode: '',
  },
};
