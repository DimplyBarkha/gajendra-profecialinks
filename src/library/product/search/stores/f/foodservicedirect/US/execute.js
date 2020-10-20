
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'foodservicedirect',
    domain: 'foodservicedirect.com',
    url: 'https://www.foodservicedirect.com/search-result?q={searchTerms}#[!opt!]{"block_ads":false}[/!opt!]',
    loadedSelector: 'div.c-product-card',
    noResultsXPath: '//h2[contains(@class, "p-no-result__intro-title")]',
  },
};
