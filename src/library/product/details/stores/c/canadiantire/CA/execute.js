
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    domain: 'canadiantire.ca',
    loadedSelector: 'div.pdp-image-carousel,div.pdp-product-image-and-buy-box__inner',
    noResultsXPath: '//font[contains(text(),"The page you’re looking for isn’t here. Visit our")]',
    zipcode: '',
  },
};
