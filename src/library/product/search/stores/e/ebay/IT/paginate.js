
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'ebay',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class=tpgv]',
    noResultsXPath: '//div[contains(@class, "tprs") and not(descendant::div[contains(@class, "tpgv")])]',
    openSearchDefinition: null,
    domain: 'ebay.it',
    zipcode: '',
  },
};
