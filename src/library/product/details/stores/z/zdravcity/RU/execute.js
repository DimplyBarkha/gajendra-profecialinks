
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'zdravcity',
    domain: 'zdravcity.ru',
    loadedSelector: 'h1.b-product-new__title',
    noResultsXPath: "//span[text()='Страница не найдена']",
    zipcode: '',
  },
};
