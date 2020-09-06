
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    nextLinkSelector: 'a[title~="Следующие"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.indexGoods__item',
    noResultsXPath: '//div[@class="content__mainColumn"]',
    openSearchDefinition: null,
    domain: 'onlinetrade.ru',
    zipcode: '',
  },
};
