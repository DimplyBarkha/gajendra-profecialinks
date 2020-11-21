
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    nextLinkSelector: 'a.PaginationWidget__arrow_right',
    mutationSelector: null,
    spinnerSelector: '.StickyOverlayLoader__preloader',
    loadedSelector: 'div.ProductCardCategoryList__grid-container',
    noResultsXPath: '//h1[contains(text(),"По Вашему запросу")]',
    openSearchDefinition: null,
    domain: 'citilink.ru',
    zipcode: '',
  },
};
