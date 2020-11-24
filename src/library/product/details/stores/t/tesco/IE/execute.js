
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'tesco',
    domain: 'tesco.ie',
    loadedSelector: 'div.productDetailsContainer',
    noResultsXPath: "//p[@class='noProdsAvlbl']",
    zipcode: '',
  },
};
