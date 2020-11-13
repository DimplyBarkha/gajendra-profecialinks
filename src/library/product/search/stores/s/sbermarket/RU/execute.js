
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'sbermarket',
    domain: 'sbermarket.ru/metro',
    url: 'https://sbermarket.ru/metro/search?keywords={searchTerms}',
    loadedSelector: 'ul.load_container a.product__link',
    noResultsXPath: '//div[@class="resource-not-found"]',
    zipcode: "''",
  },
};
