
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    domain: 'wildberries.ru',
    loadedSelector: 'div[id="container"]',
    noResultsXPath: '//p[contains(@class,"searching-results-text")]',
    zipcode: '',
  },
};