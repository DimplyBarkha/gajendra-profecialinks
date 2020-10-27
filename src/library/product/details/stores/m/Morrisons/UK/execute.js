
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    domain: 'groceries.morrisons.com',
    loadedSelector: 'section[id="categories"]',
    noResultsXPath: '//p[@class="hd-searchTermCorrection__noResultsFoundMessage"]',
    zipcode: '',
  },
};
