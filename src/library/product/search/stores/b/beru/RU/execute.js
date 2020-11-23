
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    domain: 'beru.ru',
    url: 'https://beru.ru/search?text={searchTerms}',
    loadedSelector: 'div[data-zone-name=SearchSerp] div.cia-vs',
    noResultsXPath: '//div[contains(@data-apiary-widget-id,"NotFound")]',
    zipcode: '',
  },
};
