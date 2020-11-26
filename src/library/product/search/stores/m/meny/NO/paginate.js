
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'meny',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'picture[class="ws-product-vertical__image"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'meny.no',
    zipcode: '',
  },
};
