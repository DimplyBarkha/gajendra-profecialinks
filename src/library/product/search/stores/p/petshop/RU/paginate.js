
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    nextLinkSelector: 'a.next',
    mutationSelector: null,
    spinnerSelector: 'article.article-catalogue[style="opacity: 0.25;"]',
    loadedSelector: 'article.article-catalogue:not([style])',
    noResultsXPath: '//div[@class="search-result-items"]//p[@class="errortext"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'petshop.ru',
    zipcode: '',
  },
};
