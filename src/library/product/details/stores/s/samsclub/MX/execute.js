
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'samsclub',
    domain: 'sams.com.mx',
    loadedSelector: 'div.pdp-info-container',
    noResultsXPath: "//div[contains(@class,'error404-image')]",
    zipcode: '',
  },
};
