
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.sc-1pejwl4-0',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.verkkokauppa.com/fi/search?pageNo={page}&query={searchTerms}',
    },
    domain: 'verkkokauppa.com',
    zipcode: '',
  },
};
