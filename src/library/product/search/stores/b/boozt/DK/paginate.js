
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    nextLinkSelector: 'button[class="btn btn--secondary btn--big pagination__btn-next"]:not([disabled])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="product-list clearfix"]',
    noResultsXPath: '//h2[@class="fsearchnoresults__header"] |//a[@class="btn btn--secondary text-left"]',
    openSearchDefinition: null,
    domain: 'boozt.com',
    zipcode: '',
  },
};
