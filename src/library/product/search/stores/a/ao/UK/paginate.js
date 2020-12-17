
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    nextLinkSelector: 'footer > ul > li > a[data-testid*="pagination-more"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a > img[class*="primary-image"]',
    noResultsXPath: '//div[@class="no-results"]' ,
    openSearchDefinition: null,
    domain: 'ao.com',
    zipcode: '',
  },
};
