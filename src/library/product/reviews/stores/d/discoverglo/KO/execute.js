
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    domain: 'discoverglo.co.kr',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"error")]/h1/small[contains(text(),"Page not found")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
