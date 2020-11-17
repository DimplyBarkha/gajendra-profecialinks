
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'bigbasketMweb',
    domain: 'bigbasket.com',
    loadedSelector: 'div#carousel',
    noResultsXPath: '//div[@class="uiv2-no-results-new"]',
  },
};
