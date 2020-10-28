
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'spar',
    domain: 'spar.no',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="cw-section"]/h1[contains(text(), "Ukjent vare")]',
    zipcode: '',
  },
};
