
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'qvc',
    domain: 'qvc.it',
    url: 'https://www.qvc.it/search.html?search-term={searchTerms}',
    loadedSelector: "div[class*='discovery-body'] div[class*='tile-product']",
    noResultsXPath: "//li[contains(@class,'total-products') and contains(.,'0 Prodotti')] | //h1//span[@itemprop='name']",
    zipcode: '',
  },
};
