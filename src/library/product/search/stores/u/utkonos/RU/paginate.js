
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'utkonos',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.catalog-grid',
    noResultsXPath: '//h1[contains(text(), "По запросу")]',
    openSearchDefinition: {
      template: 'https://www.utkonos.ru/search/{searchTerms}/page/{page}',
      pageOffset: 0,
    },
    domain: 'utkonos.ru',
    zipcode: "''",
  },
};
