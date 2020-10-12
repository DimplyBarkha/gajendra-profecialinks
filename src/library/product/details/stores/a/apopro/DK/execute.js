
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'apopro',
    domain: 'apopro.dk',
    loadedSelector: 'div.productinfo',
    noResultsXPath: '//h1[contains(.,"Desværre!")]',
    zipcode: '',
  },
};
