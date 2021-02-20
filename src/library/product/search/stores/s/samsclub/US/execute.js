
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    //url: 'https://samsclub.com/s/{searchTerms}',
    url:'https://www.samsclub.com/api/node/vivaldi/v2/az/products/search?sourceType=1&sortKey=relevance&sortOrder=1&limit=48&searchTerm={searchTerms}&clubId=6384&br=true#[!opt!]{"type":"json"}[/!opt!]'
    //loadedSelector: 'div.sc-plp-layout',
    //noResultsXPath: '//div[@class="sc-error-page-title"]',
  },
};
