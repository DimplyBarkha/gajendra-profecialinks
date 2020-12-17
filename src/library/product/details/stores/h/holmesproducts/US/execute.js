
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    domain: 'holmesproducts.com',
    loadedSelector: 'div#primary , .product-detail .primary-images',
    noResultsXPath: '//h1[contains(text(),"Page Not Found")] | //h2[contains(text(),"page was not found")]',
    zipcode: '',
  },
};
