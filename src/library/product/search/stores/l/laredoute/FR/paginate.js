
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    nextLinkSelector: '#next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#productList',
    noResultsXPath: '//div[@id="errorSearchNoResult"]',
    openSearchDefinition: null,
    domain: 'laredoute.fr',
    zipcode: '',
  },
};
