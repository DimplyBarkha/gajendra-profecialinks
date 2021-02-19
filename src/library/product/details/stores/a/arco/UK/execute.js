
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    domain: 'arco.co.uk',
    loadedSelector: 'div#imageholder img[id="lpic"]',
    noResultsXPath: '//div[@id="no-results"]//iframe/@src',
    zipcode: '',
  },
};
