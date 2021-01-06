
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    loadedSelector: 'section#main',
    noResultsXPath: '//h1[contains(text(), "This Page Is Missing or Moved")]',
    zipcode: '',
  },
};
