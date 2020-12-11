module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'luluwebstore',
    domain: 'luluhypermarket.com',
    url: 'https://www.luluhypermarket.com/en-ae/search/?text={searchTerms}%3Arelevance',
    loadedSelector: 'ul[class="product__listing product__grid col-xs-12"] div[class="col-lg-3 col-md-4 col-sm-6 col-xs-6 plp-product-div js-owl-carousel-reference "]',
    noResultsXPath: null,
    zipcode: '',
  },
};