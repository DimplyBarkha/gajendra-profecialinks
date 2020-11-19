module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    domain: 'nykaa.com',
    noResultsXPath: '//td[contains(@class,"products depth_1")]/table/tbody[count(*)=0]',
    url: 'https://www.nykaa.com/nyk/aggregator-gludo/api/search.list?filter_format=v2&from=0&page_no=1&search={searchTerms}&source=react#[!opt!]{"type":"json"}[/!opt!]',
  },
};
