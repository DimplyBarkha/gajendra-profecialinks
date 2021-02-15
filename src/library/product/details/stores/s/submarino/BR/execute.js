
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    domain: 'submarino.com.br',
    loadedSelector: 'html body',
    noResultsXPath: '//div[contains(@class, "EmptyPage__Container")]',
    zipcode: '',
  },
};
