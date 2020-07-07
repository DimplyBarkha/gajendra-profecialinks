module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    domain: 'groceries.asda.com',
    store: 'asda',
    url: 'https://groceries.asda.com/api/items/search?productperpage=60&pagenum=1&keyword={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'td.items.depth_0 > table > tbody > tr',
    noResultsXPath: '//td[@class="errorCode depth_1"]',
  },
};
