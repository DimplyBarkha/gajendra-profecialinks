
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    domain: 'elcorteingles.es',
    loadedSelector: 'div.js-sticky-control',
    noResultsXPath: '//div[contains(@class,"artwork image")]',
    zipcode: '',
  },
};
