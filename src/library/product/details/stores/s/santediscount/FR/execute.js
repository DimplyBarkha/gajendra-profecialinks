
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    domain: 'santediscount.com',
    loadedSelector: null,
    noResultsXPath: `//div[@class='catalogsearch_no_result--content']`,
    zipcode: '',
  },
};
