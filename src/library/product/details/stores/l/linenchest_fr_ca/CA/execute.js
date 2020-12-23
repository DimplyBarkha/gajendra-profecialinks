
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'linenchest_fr_ca',
    domain: 'linenchest.com',
    // loadedSelector: null,
    noResultsXPath: '//p[contains(.,"Le produit que vous recherchez semble ne plus être offert")]',
    zipcode: '',
  },
};
