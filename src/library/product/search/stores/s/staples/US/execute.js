
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'staples',
    domain: 'staples.com',
    url: 'https://www.staples.com/{searchTerms}/directory_{searchTerms}',
    loadedSelector: "div[class*='productView__productTileContainer'] div[class*='nested_grid_content']",
    noResultsXPath: "//div[@class='NullPage__comNullPageHeading']",
    zipcode: '',
  },
};
