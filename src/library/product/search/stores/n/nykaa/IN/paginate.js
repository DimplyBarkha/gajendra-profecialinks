
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      offset: 22,
      template: 'https://www.nykaa.com/nyk/aggregator-gludo/api/search.list?filter_format=v2&from=0&page_no=1&search={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'nykaa.com',
    zipcode: '',
  },
};
