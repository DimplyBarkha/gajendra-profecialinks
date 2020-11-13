
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    nextLinkXpath: '(//a[@rel="nofollow"]/span)[1]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'linio.com',
    zipcode: '',
  },
};
