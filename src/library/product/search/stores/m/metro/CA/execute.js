module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    domain: 'metro.ca',
    url: 'https://www.metro.ca/en/online-grocery/search-page-1?&filter={searchTerms}',
    loadedSelector: '.tile-product__top-section__visuals__stickers',
    noResultsXPath: '//div[@class="product-not-found"]',
    zipcode: '',
  },
};
