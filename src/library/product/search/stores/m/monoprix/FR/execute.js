
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'monoprix',
    domain: 'monoprix.fr',
    url: 'https://www.monoprix.fr/courses/search/product/{searchTerms}',
    loadedSelector: 'div[class*="ui cards products"]',
    noResultsXPath: '//div[contains(@class,"catalog-page__statistic")]/text()[1][.="0"]',
    zipcode: '',
  },
};
