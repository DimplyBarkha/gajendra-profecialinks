
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    nextLinkSelector: 'div.js-product-load-more',
    spinnerSelector: 'div[class="loader"][style="display: block;"]',
    noResultsXPath: '//p[contains(@class,"no-hits-content-results")]',
    domain: 'brownthomas.com',
    zipcode: '',
  },
};
