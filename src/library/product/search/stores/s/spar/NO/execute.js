
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'spar',
    domain: 'spar.no',
    url: 'https://spar.no/sok?query={searchTerms}&expanded=products',
    loadedSelector: 'li.ws-product-list-vertical__item',
    noResultsXPath: '//p[@class="ws-search-result-full__empty"]',
    zipcode: '',
  },
};
