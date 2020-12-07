
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'well',
    domain: 'well.ca',
    loadedSelector: 'div#productimage img.hidden-xs',
    noResultsXPath: '//h1[text()="Page Not Found"]',
    zipcode: '',
  },
};
