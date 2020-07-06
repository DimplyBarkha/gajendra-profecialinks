
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow_75204',
    domain: 'primenow.amazon.com',
    loadedSelector: 'table.prodDetTable tr:nth-last-child(1)',
    noResultsXPath: '//div[contains(@class,"error-page-background")]',
  },
};
