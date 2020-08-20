
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    nextLinkSelector: 'div[class="pagination__button-wrap"] button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="error-block"] div',
    noResultsXPath: '//div[@class="error-block"]/div',
    openSearchDefinition: null,
    domain: 'carrefour.fr',
    zipcode: '',
  },
};
