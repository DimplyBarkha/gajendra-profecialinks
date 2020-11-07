
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'bidfood',
    domain: 'bidfood.co.uk',
    url: 'https://www.bidfood.co.uk/?s={searchTerms}',
    loadedSelector: 'main#main div.container',
    noResultsXPath: '//main[@id="main"]/div[@class="container"]//h3[text()="Sorry no results were found."]',
    zipcode: '',
  },
};
