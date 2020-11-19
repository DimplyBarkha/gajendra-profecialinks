
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UA',
    store: 'metro',
    domain: 'metro.ua',
    url: 'https://metro.zakaz.ua/ru/search?q={searchTerms}',
    loadedSelector: 'div.products-box',
    noResultsXPath: '//span[contains(text(), "Мы не смогли найти результаты")]',
    zipcode: '',
  },
};
