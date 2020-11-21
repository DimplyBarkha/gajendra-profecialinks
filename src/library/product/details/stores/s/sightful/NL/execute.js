
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'sightful',
    domain: 'sightful.nl',
    loadedSelector: 'div.page-title-wrapper',
    noResultsXPath: "//h4[contains(text(),'The page you requested was not found, and we have a fine guess why')]",
    zipcode: '',
  },
};
