
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    noResultsXPath: '//div[@role="alertdialog"]/div[@class="sc-error-page-title"]',
  },
};
