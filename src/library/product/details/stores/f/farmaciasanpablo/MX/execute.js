
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasanpablo',
    domain: 'farmaciasanpablo.com.mx',
    loadedSelector: 'body',
    noResultsXPath:  '//*[@id="body-main-container"]/div[contains(@class, "search-empty")]',
    zipcode: '',
  },
};
