
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    domain: 'flaschenpost.de',
    loadedSelector: 'div[class="page-detail"]',
    noResultsXPath: '//div[@class="error-page-container"]',
    zipcode: '28203',
  },
};
