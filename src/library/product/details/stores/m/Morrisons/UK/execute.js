
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    domain: 'groceries.morrisons.com',
    loadedSelector: 'section#productInformation',
    noResultsXPath: '//p[@class="nf-resourceNotFound__heading"]',
    zipcode: '',
  },
};
