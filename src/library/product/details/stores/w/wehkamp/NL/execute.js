
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'wehkamp',
    domain: 'wehkamp.nl',
    loadedSelector: 'div#content',
    noResultsXPath: "//div[@class='errorpage-content']//div[@class='errorpage-message']",
    zipcode: '',
  },
};
