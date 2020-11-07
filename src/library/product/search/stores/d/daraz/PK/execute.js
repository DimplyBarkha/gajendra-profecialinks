
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PK',
    store: 'daraz',
    domain: 'daraz.pk',
    url: 'https://www.daraz.pk/catalog/?q={searchTerms}',
    loadedSelector: 'div[data-qa-locator="product-item"]',
    noResultsXPath: '//div[contains(text(),"Search No Result")]',
    zipcode: "''",
  },
};
