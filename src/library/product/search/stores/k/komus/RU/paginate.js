
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'komus',
    nextLinkSelector: 'div[class="b-productList__controls"] ul[class="b-menu--horizontal b-pageNumber"] li a[class="b-pageNumber__item b-pageNumber__item--arrow b-pageNumber__item--next b-pageNumber__item--text"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'komus.ru',
    zipcode: '',
  },
};
