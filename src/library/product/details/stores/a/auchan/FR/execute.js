
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    loadedSelector: 'div.container-fluid',
    noResultsXPath: "//div[contains(@class, 'error-container')]//p | //h1[@class='editorial__block-title']",
    zipcode: '',
  },
};
