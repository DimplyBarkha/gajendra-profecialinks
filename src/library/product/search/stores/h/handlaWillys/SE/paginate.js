
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'handlaWillys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.ax-product-puff-image img ',
    noResultsXPath: '//div[contains(@class,"no-search-result")]',
    // openSearchDefinition: null,
    domain: 'willys.se',
    zipcode: '',
  },
};
