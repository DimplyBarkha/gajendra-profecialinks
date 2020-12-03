
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    domain: 'newpharma.nl',
    loadedSelector: 'div.product-details img',
    noResultsXPath: '//body[contains(@class, "Error")]',
    zipcode: "''",
  },
};
