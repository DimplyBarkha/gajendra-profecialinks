
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-test="product-list"]',
    noResultsXPath: '//h1[contains(text(), "Sorry, we couldn")] | //h1[text()="404 Not Found"]',
    openSearchDefinition: null,
    domain: 'waitrose.com',
    zipcode: '',
  },
};
