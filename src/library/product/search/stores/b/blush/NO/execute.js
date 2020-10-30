
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'blush',
    domain: 'blush.no',
    url: 'https://www.blush.no/search?q={searchTerms}',
    loadedSelector: 'form.product-list',
    noResultsXPath: '//div[@class="responsive-content-wrapper"]//div[@class="alert-content"]',
    zipcode: '',
  },
};
