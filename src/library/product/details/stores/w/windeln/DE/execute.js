
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    domain: 'windeln.de',
    loadedSelector: '.main-content',
    noResultsXPath: "//body[@id='pageId-exception']/div[@id='mainContainer']/div[@class='main-wrapper']",
    zipcode: '',
  },
};
