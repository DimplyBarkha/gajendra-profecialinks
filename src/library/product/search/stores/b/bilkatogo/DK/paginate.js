
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'bilkatogo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a[class*=\'product-card__link\']',
    noResultsXPath: '//div[contains(@class, \'row no-results\')]',
    openSearchDefinition: null,
    domain: 'bilkatogo.dk',
    zipcode: '',
  },
};
