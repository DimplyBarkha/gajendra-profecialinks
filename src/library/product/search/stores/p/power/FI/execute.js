
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'power',
    domain: 'power.fi',
    url: 'https://www.power.fi/haku/?q=%22{searchTerms}%22',
    loadedSelector: 'div#product-section',
    noResultsXPath: '//h2[@class="product-qty-header ng-star-inserted"]/span[@class="total-qty"][text()=" 0"]',
    zipcode: '',
  },
};
