
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    domain: 'groceries.morrisons.com',
    loadedSelector: 'section[id="categories"]',
    noResultsXPath: '//div[@class="nf-resourceNotFound"]',
    zipcode: '',
  },
};
