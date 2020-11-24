
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    domain: 'dermstore.com',
    url: 'https://www.dermstore.com/list_checkbox.php?search&lkey={searchTerms}',
    loadedSelector: "div[id*='prodGrid'] div[class*='prod-widget-responsive']",
    noResultsXPath: "//h1//strong[starts-with(text(), '0 product results for')]",
    zipcode: '',
  },
};
