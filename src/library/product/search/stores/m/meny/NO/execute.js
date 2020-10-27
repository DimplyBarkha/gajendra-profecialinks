module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    domain: 'meny.no',
    url: 'https://meny.no/Sok/?query={searchTerms}',
    loadedSelector: 'picture[class="ws-product-vertical__image"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
