
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    nextLinkSelector: 'li.disabled[xpath="1"]>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.items-container',
    noResultsXPath: '//div[@id="no-results-message"]',
    openSearchDefinition: null,
    domain: 'unieuro.it',
    zipcode: '',
  },
};
