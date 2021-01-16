
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'santehnika-online',
    domain: 'santehnika-online.ru',
    loadedSelector: 'html body',
    noResultsXPath: '(//div[contains(@class, \'search-result\')])[1]',
    zipcode: '',
  },
};
