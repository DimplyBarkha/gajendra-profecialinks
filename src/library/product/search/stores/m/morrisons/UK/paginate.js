
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    noResultsXPath: '//div[contains(@class,"resourceNotFound")]',
    openSearchDefinition: null,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
};
