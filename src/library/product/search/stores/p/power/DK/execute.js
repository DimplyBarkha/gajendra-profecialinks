
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'power',
    domain: 'power.dk',
    url: 'https://www.power.dk/search/?q=%22{searchTerms}%22',
    loadedSelector: 'div#product-section',
    noResultsXPath: '//h2[@class="product-qty-header ng-star-inserted"]/span[@class="total-qty"][text()=" 0"]',
    zipcode: '',
  },
};
