
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    domain: 'discoverglo.co.kr',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"error")]/h1/small[contains(text(),"Page not found")]',
    zipcode: '',
  },
};
