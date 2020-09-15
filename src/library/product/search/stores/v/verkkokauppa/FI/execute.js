
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    domain: 'verkkokauppa.com',
    url: 'https://www.verkkokauppa.com/fi/search?query={searchTerms}',
    loadedSelector: 'ol.product-list-detailed',
    noResultsXPath: "//section[contains(@class,'zracwc-0 kaKFIU')]",
    zipcode: '',
  },
};
