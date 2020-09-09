
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    domain: 'ozon.ru',
    loadedSelector: null,
    noResultsXPath: '//div[@class="error-main"]//h2[contains(text(),"Произошла ошибка")]',
    zipcode: '',
  },
};
