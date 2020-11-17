
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    domain: 'petshop.ru',
    url: 'https://www.petshop.ru/search/?q={searchTerms}',
    loadedSelector: 'article.article-catalogue:not([style])',
    noResultsXPath: '//div[@class="search-result-items"]//p[@class="errortext"]',
    zipcode: '',
  },
};
