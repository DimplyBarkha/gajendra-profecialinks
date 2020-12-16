
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'falabella',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.jsx-1987097504,main',
    noResultsXPath: '//div[contains(@class,"no-result")]//h3',
    openSearchDefinition: null,
    domain: 'falabella.com',
    zipcode: '',
  },
};
