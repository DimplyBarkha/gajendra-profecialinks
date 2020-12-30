module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    domain: 'mediamarkt.pl',
    url: 'https://mediamarkt.pl/search?query[menu_item]=&query[querystring]={searchTerms}&page=1&limit=150',
    loadedSelector: null,
    noResultsXPath: `//div[@class="s-search_empty"]`,
    zipcode: '',
  },
};
