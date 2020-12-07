
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    domain: 'electronic4you.at',
    url: 'https://www.electronic4you.at/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.main-container, col2-left-layout',
    noResultsXPath: '//div[@class="inner-container"]//div[contains(@class,"grid-col2-main")]/p[contains(text(),"Zu Ihrer Suchanfrage konnten keine Ergebnisse gefunden werden") and @class="note-msg"]',
    zipcode: '',
  },
};
