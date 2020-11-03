
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    nextLinkSelector: 'div[class="pagination__button-wrap"] button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class="side-template__section"]',
    noResultsXPath: '//div[@class="error-block"]/div',
    openSearchDefinition: null,
    domain: 'carrefour.fr',
    zipcode: '',
  },
};
