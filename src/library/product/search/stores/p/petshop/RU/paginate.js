
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    nextLinkSelector: 'a.next',
    mutationSelector: null,
    spinnerSelector: 'article.article-catalogue[style="opacity: 0.25;"]',
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'petshop.ru',
    zipcode: '',
  },
};
