module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    domain: 'mediaexpert.pl',
    url: 'https://www.mediaexpert.pl/search?query[menu_item]=&query[querystring]={searchTerms}',
    loadedSelector: 'h2[data-zone*="OFFERBOX_NAME"]',
    noResultsXPath: '//div[contains(@class,"noResults")]//p[1]',
    zipcode: '',
  },
};
