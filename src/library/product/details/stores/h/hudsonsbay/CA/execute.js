
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    domain: 'thebay.com',
    loadedSelector: null,
    noResultsXPath: "//span[contains(@class, 'search-keywords') and contains(text(), 'weren’t able to find any results')]",
    zipcode: '',
  },
};
