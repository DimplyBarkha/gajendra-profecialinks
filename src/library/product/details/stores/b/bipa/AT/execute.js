module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'bipa',
    domain: 'bipa.at',
    loadedSelector: '.pdp__wrapper',
    noResultsXPath: '//div[@class="inner"]',
  },
};
