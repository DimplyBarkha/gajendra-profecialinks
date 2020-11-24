
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SK',
    store: 'tesco',
    domain: 'tesco.sk',
    loadedSelector: 'div.product-details-tile__main',
    noResultsXPath: "//section[@class='error-container']",
    zipcode: '',
  },
};
