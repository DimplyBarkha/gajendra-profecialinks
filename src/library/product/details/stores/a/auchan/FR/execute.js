
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    loadedSelector: 'div.image-tapToZoom--overlay',
    noResultsXPath: "//div[contains(@class, 'error-container')]//p",
    zipcode: '',
  },
};
