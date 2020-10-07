
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    nextLinkSelector: '',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.mini-product',
    noResultsXPath: '//h2[contains(text(),"Tyvärr kunde vi inte hitta någonting som matchade din sökning")]',
    openSearchDefinition: null,
    domain: 'elgiganten.se',
    zipcode: '',
  },
};
