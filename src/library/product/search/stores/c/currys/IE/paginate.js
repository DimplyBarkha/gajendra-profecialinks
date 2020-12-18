
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'currys',
    nextLinkSelector: 'ul[class*="pagination"] a[title="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-component="list-page-product-list"] article.product div.product-images',
    noResultsXPath: '//p[contains(text(), "No results were found")]',
    openSearchDefinition: null,
    domain: 'currys.ie',
    zipcode: 'D02TX94',
  },
};
