
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SW',
    store: 'verkkokauppa',
    nextLinkSelector: null, 
    loadedSelector: 'div.sc-1pejwl4-0',
    noResultsXPath: null,     
    domain: 'verkkokauppa.com',
    openSearchDefinition: {
      // offset: 24,
      template: 'https://www.verkkokauppa.com/fi/search?pageNo={page}&query={searchTerms}',
    }
  },
};
