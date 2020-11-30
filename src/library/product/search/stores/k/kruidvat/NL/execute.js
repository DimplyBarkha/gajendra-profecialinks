
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    domain: 'kruidvat.nl',
    // url: 'https://www.kruidvat.nl/search?q=aftersun&text=aftersun&searchType=manual',
    // url: 'https://www.kruidvat.nl/search?q={searchTerms}&searchType=manual',
    // url:  'https://www.kruidvat.nl/search?q=48+uur+werking&text=48+uur+werking&searchType=manual',
    url:  'https://www.kruidvat.nl/search?q={searchTerms}&text={searchTerms}&searchType=manual',
    loadedSelector: 'div.product__list-container > div > article:not([class="no-hover"])',
    noResultsXPath:'//div[@class="content"]/h2[contains(text(),"SORRY, WE KONDEN")]',
    zipcode: '',
  },
};
