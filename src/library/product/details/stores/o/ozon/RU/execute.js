
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    domain: 'ozon.ru',
    loadedSelector: 'div.container',
    noResultsXPath: '//div[@class="error-main"]/h2[@class="main-header"]',
    zipcode: '',
  },
};
