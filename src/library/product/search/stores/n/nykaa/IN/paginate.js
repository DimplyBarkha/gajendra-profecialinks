
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'td.dynamic_tags',
    noResultsXPath: null,
    openSearchDefinition: {
      offset: 20,
      page: 1,
      template: 'https://www.nykaa.com/nyk/aggregator-gludo/api/search.list?filter_format=v2&from={offset}&page_no={page}&search={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'nykaa.com',
    zipcode: '',
  },
};
