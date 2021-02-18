
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    domain: 'petshop.ru',
    loadedSelector: null,
    noResultsXPath: '//div[@class="search-result-items"]//p[@class="errortext" and contains(. , "ничего не найдено")]',
    zipcode: '',
  },
};
