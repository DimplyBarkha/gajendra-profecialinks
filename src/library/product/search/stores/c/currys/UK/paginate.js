
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    nextLinkSelector: 'ul.pagination li > a[title="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.resultList article.product',
    noResultsXPath: '//div[@class="product-page"]',
    openSearchDefinition: null,
    domain: 'currys.co.uk',
    zipcode: "''",
  },
};
