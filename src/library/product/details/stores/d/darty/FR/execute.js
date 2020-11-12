
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    domain: 'darty.com',
    loadedSelector: 'div.product_body',
    noResultsXPath: '//span[contains(text(),"résultat pou")]',
    zipcode: '',
  },
};
