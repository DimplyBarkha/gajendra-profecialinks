
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    domain: 'homedepot.com',
    loadedSelector: 'div#productinfo_ctn, div[data-lg-name="Product Page"]',
    noResultsXPath: '//p[contains(text(),"The product you are trying to view is not currently available")]',
  },
};
