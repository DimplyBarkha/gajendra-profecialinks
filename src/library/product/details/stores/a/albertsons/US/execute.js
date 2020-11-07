module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'albertsons',
    domain: 'albertsons.com',
    loadedSelector: null,
    noResultsXPath: '//div[contains(text()," This item is not available right now ")]',
    zipcode: '83642',
  },
};
