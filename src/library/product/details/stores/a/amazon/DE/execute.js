
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    domain: 'amazon.de',
    loadedSelector: '#landingImage',
    noResultsXPath: '//*[contains(text(), "ENTSCHULDIGUNG")]',
    zipcode: '10117',
  },
};
