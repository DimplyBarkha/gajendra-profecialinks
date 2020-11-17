
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    domain: 'verkkokauppa.com',
    url: 'https://www.verkkokauppa.com/fi/search?query={searchTerms}',
    //loadedSelector: 'ol.product-list-detailed',
    loadedSelector: 'ol.product-list-detailed , ol.big-product-grid',
    //noResultsXPath: "//section[contains(@class,'zracwc-0 kaKFIU')]",
    noResultsXPath:'//section[contains(@class,"zracwc-0 djTZwO")]//header',
    zipcode: '',
  },
};
