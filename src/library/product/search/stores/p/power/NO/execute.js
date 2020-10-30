
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'power',
    domain: 'power.no',
    url: 'https://www.power.no/search/?q=%22{searchTerms}%22',
    loadedSelector: 'div#product-section',
    noResultsXPath: '//h2[@class="product-qty-header ng-star-inserted"]/span[@class="total-qty"][text()=" 0"]',
    zipcode: '',
  },
};
