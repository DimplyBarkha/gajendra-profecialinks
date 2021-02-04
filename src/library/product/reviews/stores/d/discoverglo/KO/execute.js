
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    domain: 'discoverglo.co.kr',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="intro-contents-wrap"]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
