module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    domain: 'mediamarkt.pl',
    url: 'https://mediamarkt.pl/search?query[menu_item]=&query[querystring]={searchTerms}&page=1&limit=150',
    loadedSelector: 'div[class*="m-offerBox_content"] , div[class*="m-productsBox_container"]',
    noResultsXPath: '//div[@class="s-search_empty"]',
    zipcode: '',
  },
};
