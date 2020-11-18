
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    domain: 'docmorris.de',
    loadedSelector: 'h1[itemprop="name"]',
    noResultsXPath: '//div[@class="cm-text-static"]',
    zipcode: '',
  },
};
