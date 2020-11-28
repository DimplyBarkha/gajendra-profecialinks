
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'lyreco',
    domain: 'lyreco.com',
    loadedSelector: 'div.s7flyoutzoom img',
    noResultsXPath: '//h1[text()="Not Found"]',
    zipcode: '',
  },
};
