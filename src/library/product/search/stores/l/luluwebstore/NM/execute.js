
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NM',
    store: 'LuluWebstore',
    domain: 'luluhypermarket.com',
    url: 'https://www.luluhypermarket.com/en-ae/search/?q={searchTerms}:relevance',
    loadedSelector: 'ul[class="product__listing product__grid col-xs-12"] div[class="col-lg-3 col-md-4 col-sm-6 col-xs-6 plp-product-div js-owl-carousel-reference "]',
    noResultsXPath: null,
    zipcode: '',
  },
};
