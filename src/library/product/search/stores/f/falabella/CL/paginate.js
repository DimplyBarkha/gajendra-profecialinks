
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'falabella',
    nextLinkSelector: 'div.pagination button#testId-pagination-bottom-arrow-right',
    mutationSelector: null,
    spinnerSelector: 'div.loader div.spinner',
    loadedSelector: 'div.jsx-1987097504,main',
    noResultsXPath: '//div[contains(@class,"no-result")]//h3',
    openSearchDefinition: null,
    domain: 'falabella.com',
    zipcode: '',
  },
};