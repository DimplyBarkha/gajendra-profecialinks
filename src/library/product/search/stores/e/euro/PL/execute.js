
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    domain: 'euro.com.pl',
    url: 'https://www.euro.com.pl/search.bhtml?keyword={searchTerms}',
    //url:'https://www.euro.com.pl/telewizory-led-lcd-plazmowe,smart-tv-!smart-tv.bhtml?link=search'
    //url: 'https://www.euro.com.pl/search.bhtml?keyword={searchTerms},strona-{page}.bhtml',
    loadedSelector: 'div#products',
    noResultsXPath: '//div[@id="empty-search"]',
    zipcode: '',
  },
};
