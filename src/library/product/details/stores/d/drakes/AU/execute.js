module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'drakes',
    domain: 'drakes.com.au',
    loadedSelector: null,
    noResultsXPath: '//div[@class="MoreInfo"]/header[@class="MoreInfo__Header"]//div[@class="MoreInfo__Banner__Name"]/strong',
    zipcode: '',
  },
};
