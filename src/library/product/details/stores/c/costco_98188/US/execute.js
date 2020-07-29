
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'costco_98188',
    domain: 'costco.com',
    loadedSelector: 'h1[itemprop="name"]',
    noResultsXPath: '//div[@id="not_found_body"]',
  },
};
