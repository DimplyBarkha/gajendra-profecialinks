
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    nextLinkSelector: 'a.page-link.ultima',
    mutationSelector: null,
    spinnerSelector: 'div.loading div.sk-fading-circle div.sk-circle::before',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
};
