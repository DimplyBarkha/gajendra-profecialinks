
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    domain: 'eapteka.ru',
    url: 'https://www.eapteka.ru/search/?q={searchTerms}',
    loadedSelector: 'section.sec-inner.sec-categories.sec-search',
    noResultsXPath: '//div[contains(., "По запросу") and contains(., "ничего не найдено")]',
    zipcode: "''",
  },
};
