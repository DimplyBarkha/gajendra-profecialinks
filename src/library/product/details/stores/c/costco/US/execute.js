
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'costco',
    domain: 'costco.com',
    loadedSelector: null,
    noResultsXPath: '//div[@id="not_found_body"]',
    zipcode: '94209',
  },
};
