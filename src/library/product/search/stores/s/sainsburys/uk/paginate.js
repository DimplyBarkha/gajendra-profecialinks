
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    openSearchDefinition: {
      template: 'https://www.sainsburys.co.uk/gol-ui/SearchDisplayView?filters[keyword]={searchTerms}&pn={page}',
    },
    domain: 'sainsburys.co.uk',
  },
    noResultsXPath: null,
    zipcode: '',
  };
