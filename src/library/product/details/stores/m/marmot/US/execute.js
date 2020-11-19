
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'marmot',
    domain: 'marmot.com',
    loadedSelector: 'div.product-detail',
    noResultsXPath: "//div[contains(@class,'page-not-found-wrapper')]",
    zipcode: '',
  },
};
