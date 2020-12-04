
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    domain: 'e-bebek.com',
    url: 'https://www.e-bebek.com/search?text={searchTerms}',
    loadedSelector: 'section.product-list',
    noResultsXPath: '//div[@class="product-detail-main bg-white static static-page"]',
    zipcode: '',
  },
};
