
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline',
    domain: 'shop.coles.com.au',
    loadedSelector: 'div[class*="product-hero-image-container"] img',
    noResultsXPath: "//h1[contains(@class,'error-heading')] | //nav[not(contains(@class,'ng-hide'))]//ol[contains(@id,'tablist')]//li",
    zipcode: '',
  },
};
