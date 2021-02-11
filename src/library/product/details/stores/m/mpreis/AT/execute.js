
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    domain: 'shop.mpreis.at',
    loadedSelector: '',
    noResultsXPath: '//h1[@class="pageHead"][contains(.,"Fehler")]',
    zipcode: '',
  },
};
