
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    domain: 'nykaa.com',
    url: 'https://www.nykaa.com/nyk/aggregator-gludo/api/search.list?filter_format=v2&from=0&page_no=1&search={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
