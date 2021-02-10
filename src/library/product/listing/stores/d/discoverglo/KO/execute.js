
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    domain: 'discoverglo.co.kr',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"error")]/h1/small[contains(text(),"Page not found")]',
    gotoUrlTemplate: null,
    zipcode: '',
  },
};
