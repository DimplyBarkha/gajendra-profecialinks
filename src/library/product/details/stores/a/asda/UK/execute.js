
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    domain: 'groceries.asda.com',
    noResultsXPath: '//div[contains(@class, "search-content-header__results-count") and contains(text(), "(0 search")]',
  },
};
