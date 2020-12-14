
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NM',
    store: 'luluwebstore',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="product__listing product__grid col-xs-12"] div[class="col-lg-3 col-md-4 col-sm-6 col-xs-6 plp-product-div js-owl-carousel-reference "]',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.luluhypermarket.com/en-ae/search?q={searchTerms}%3Arelevance&page={page}',
      },
    domain: 'luluhypermarket.com',
    zipcode: '',
  },
};