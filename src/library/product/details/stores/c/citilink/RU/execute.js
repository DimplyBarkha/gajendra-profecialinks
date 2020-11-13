
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    domain: 'citilink.ru',
    loadedSelector: '.MainWrapper',
    noResultsXPath: '//span[contains(text(), "страница не найдена")]',
    zipcode: '',
  },
};
