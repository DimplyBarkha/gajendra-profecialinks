
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'spar',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li.ws-product-list-vertical__item',
    noResultsXPath: '//p[@class="ws-search-result-full__empty"]',
    openSearchDefinition: null,
    domain: 'spar.no',
    zipcode: '',
  },
};
