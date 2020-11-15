
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ProductCardCategoryList__grid-container',
    noResultsXPath: '//h1[contains(text(),"По Вашему запросу")]',
    openSearchDefinition: {
      template: 'https://www.citilink.ru/search/?text={searchTerms}&page={page}',
    },
    domain: 'citilink.ru',
    zipcode: '',
  },
};
