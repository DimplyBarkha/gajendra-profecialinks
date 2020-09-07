

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    nextLinkSelector: 'div.js-product-load-more[data-grid-url*="https://www.brownthomas.com/search"]',
    mutationSelector: null,
    spinnerSelector: 'div[class="loader"][style="display: block;"]',
    loadedSelector: null,
    noResultsXPath: '//p[contains(@class,"no-hits-content-results")]',
    openSearchDefinition: null,
    domain: 'brownthomas.com',
    zipcode: '',
  },

};
