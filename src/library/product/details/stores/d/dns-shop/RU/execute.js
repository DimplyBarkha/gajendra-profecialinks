
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    domain: 'dns-shop.ru',
    loadedSelector: null,//'.product-images-slider',
    noResultsXPath: "//h1[contains(@class, 'info-block__header') and contains(text(), 'Страница не найдена')]",
    zipcode: '',
  },
};
