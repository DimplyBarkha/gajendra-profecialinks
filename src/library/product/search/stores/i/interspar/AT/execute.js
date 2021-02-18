
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'interspar',
    domain: 'interspar.at',
    url: 'https://www.interspar.at/suche?q={searchTerms}',
    loadedSelector: '#productsFood-content > div > div.container.offerbar',
    noResultsXPath:null,// '//*[@id="searchFallback"]/div/div',
    zipcode: '',
  },
};
