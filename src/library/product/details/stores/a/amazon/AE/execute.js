
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'amazon',
    domain: 'amazon.ae',
    loadedSelector: 'div#dp-container',
    noResultsXPath: '//b[contains(@class, "h1") and contains(text(), "Looking for something?")]',
    zipcode: '',
  },
};
