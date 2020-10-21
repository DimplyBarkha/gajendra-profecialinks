
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    domain: 'wayfair.com',
    loadedSelector: 'div.PdpLayoutVariationB-top.is-sticky',
    noResultsXPath: '//div[@class="NotFound"]',
  },
};
