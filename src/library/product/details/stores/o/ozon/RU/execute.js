
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    domain: 'ozon.ru',
    loadedSelector: 'div[data-widget="webCharacteristics"] div h2[class="b0g6"]',
    noResultsXPath: '//div[@class="error-main"]//h2[contains(text(),"Произошла ошибка")]',
    zipcode: '',
  },
};
