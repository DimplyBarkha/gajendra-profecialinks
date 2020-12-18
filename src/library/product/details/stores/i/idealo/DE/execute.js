
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'idealo',
    domain: 'idealo.de',
    loadedSelector: 'h1[class*="oopStage-title"] span',
    noResultsXPath: '//h1[contains(.,"Es ist ein Problem aufgetreten")]',
    zipcode: '',
  },
};
