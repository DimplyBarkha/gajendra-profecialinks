
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'staples',
    loadedSelector: "div[class*='productView__productTileContainer'] div[class*='nested_grid_content']",
    noResultsXPath: "//div[@class='NullPage__comNullPageHeading']",
    openSearchDefinition: {
      page: 1,
      template: 'https://www.staples.com/{searchTerms}/directory_{searchTerms}?pn={page}',
    },
    domain: 'staples.com',
    zipcode: '',
  },
};
