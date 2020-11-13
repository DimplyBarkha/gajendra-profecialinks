
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'sbermarket',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.load_container a.product__link',
    noResultsXPath: '//div[@class="resource-not-found"]',
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://sbermarket.ru/metro/search?keywords={searchTerms}&page={page}',
      pageStartNb: 1,
    },
    domain: 'sbermarket.ru/metro',
    zipcode: "''",
  },
};
