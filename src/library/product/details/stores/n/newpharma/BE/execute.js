
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    domain: 'newpharma.be',
    loadedSelector: 'div.product-details > div img[alt]',
    noResultsXPath: '//body[contains(@class, "Error")]',
    zipcode: "''",
  },
};
