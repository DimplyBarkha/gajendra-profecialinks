
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'liquorland',
    domain: 'liquorland.com.au',
    url: 'https://www.liquorland.com.au/search?q={searchTerms}',
    loadedSelector: 'div.product-list div.ProductTile',
    noResultsXPath: '//div[@class="searched-term"]//div[@class="notfound"]',
    zipcode: "''",
  },
};
