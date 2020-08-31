
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    domain: 'mediamarkt.pl',
    url: 'https://www.mediamarkt.pl/search?query%5Bmenu_item%5D=&query%5Bquerystring%5D={searchTerms}',
    loadedSelector: 'div.m-offerBox',
    noResultsXPath: '//div[contains(@class, "s-search_empty")]',
    zipcode: '',
  },
};
