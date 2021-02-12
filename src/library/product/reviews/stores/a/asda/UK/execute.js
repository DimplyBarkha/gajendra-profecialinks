
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    domain: 'asda.com',
    loadedSelector: 'main.product-detail-page.layout__main',
    noResultsXPath: '//section[@class="layout__section page-not-found-layout__section"]',
    reviewUrl: 'https://groceries.asda.com/product/{id}',
    sortButtonSelectors: null,
    zipcode: "''",
  },
};
