
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    nextLinkSelector: 'a[title~="Следующие"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"content")]//h1[contains(text(),"Найденные категории")] | //div[contains(@class,"content")]//p[contains(text(),"Ничего не найдено")]',
    openSearchDefinition: null,
    domain: 'onlinetrade.ru',
    zipcode: '',
  },
};
