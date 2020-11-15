
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'chemistdirect',
    domain: 'chemistdirect.co.uk',
    loadedSelector: 'div.cd-product-main',
    noResultsXPath: "//div[@id='nxt-nrf']",
    zipcode: '',
  },
};
