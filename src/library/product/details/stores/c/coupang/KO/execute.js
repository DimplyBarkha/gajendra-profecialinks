
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'KO',
    store: 'coupang',
    domain: 'coupang.com',
    loadedSelector: 'div#container',
    noResultsXPath: '//h3[contains(@class,"error-img")]',
    zipcode: '',
  },
};
