module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    domain: 'ozon.ru',
    loadedSelector: 'div#__ozon',
    noResultsXPath: '//h2[contains(text(),"Произошла ошибка")]',
    reviewUrl: 'https://www.ozon.ru/product/{id}/reviews/?page=1&sort=created_at_desc',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
