
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'qvc',
    domain: 'qvc.it',
    url: 'https://www.qvc.it/',
    loadedSelector: "div[class*='discovery-body'] div[class*='tile-product']",
    noResultsXPath: "//li[contains(@class,'total-products') and contains(.,'0 Prodotti')]",
    zipcode: '',
  },
};
