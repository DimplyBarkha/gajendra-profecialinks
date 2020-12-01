
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'apteka',
    domain: 'apteka.ru',
    loadedSelector: '.ProductPage__title',
    noResultsXPath: '//div[@class = "not-found__content"]',
    zipcode: '',
  },
};
