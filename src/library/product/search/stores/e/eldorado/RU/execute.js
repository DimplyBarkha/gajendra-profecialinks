
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    domain: 'eldorado.ru',
    url: 'https://www.eldorado.ru/search/catalog.php?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="digi-not-found"]/p[2]',
    zipcode: '',
  },
};
