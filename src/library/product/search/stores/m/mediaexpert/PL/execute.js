module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    domain: 'mediaexpert.pl',
    url: 'https://www.mediaexpert.pl/search?query[menu_item]=&query[querystring]={searchTerms}',
    loadedSelector: 'div[data-zone="OFFERBOX_PHOTO"]>a>img',
    noResultsXPath: '//div[contains(@class,"noResults")]//p[1]',
    zipcode: '',
  },
};
