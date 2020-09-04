
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'jumbo',
    domain: 'jumbo.ae',
    loadedSelector: 'div[class*="own-product custom-layout"]',
    noResultsXPath: '//div[@class*="links_404"]/h3',
    zipcode: '',
  },
};
