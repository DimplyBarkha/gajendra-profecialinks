
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'staples',
    domain: 'staples.ca',
    loadedSelector: 'div.product__page',
    noResultsXPath: '//div[@class="Error404Page"]',
    zipcode: "''",
  },
};
