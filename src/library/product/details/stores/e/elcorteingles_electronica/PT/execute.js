
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'elcorteingles_electronica',
    domain: 'elcorteingles.es',
    loadedSelector: 'div.js-sticky-control',
    noResultsXPath: '//div[contains(@class,"artwork image")]',
    zipcode: '',
  },
};
