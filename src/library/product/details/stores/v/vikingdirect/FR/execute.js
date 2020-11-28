
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    domain: 'vikingdirect.fr',
    loadedSelector: 'body', // 'div[id="contentContainer"]',
    noResultsXPath: '//h1[contains(.,"Référence invalide")]',
    zipcode: '',
  },
};
