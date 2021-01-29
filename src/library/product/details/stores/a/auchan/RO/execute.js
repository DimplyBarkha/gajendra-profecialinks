
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RO',
    store: 'auchan',
    domain: 'auchan.ro',
    // loadedSelector: 'div.productDetailsPanel',
    noResultsXPath: '//b[contains(.,"Niciun produs nu corespunde cautarii tale.")]',
    zipcode: '',
  },
};
