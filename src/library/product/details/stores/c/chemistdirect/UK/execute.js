
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'chemistdirect',
    domain: 'chemistdirect.co.uk',
    loadedSelector: 'div.cd-product-main',
    noResultsXPath: "//div[contains(@class,'cd-products-view')]//ul[contains(@class,'cd-products-list')]",
    zipcode: '',
  },
};
