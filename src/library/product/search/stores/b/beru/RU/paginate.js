
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    nextLinkSelector: 'div[data-auto="pagination-next"]:not([disabled])',
    mutationSelector: null,
    spinnerSelector: 'div.goog-te-spinner-pos',
    loadedSelector: 'div[data-zone-name=SearchSerp] div.cia-vs',
    noResultsXPath: '//div[contains(@data-apiary-widget-id,"NotFound")]',
    // openSearchDefinition: {
    //   template: 'https://pokupki.market.yandex.ru/search?cvredirect=2&text={searchTerms}&page={page}'
    // },
    domain: 'beru.ru',
    zipcode: '',
  },
};
