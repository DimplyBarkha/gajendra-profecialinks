
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'brake',
    domain: 'brake.co.uk',
    loadedSelector: 'div.productDetailsPageSection1',
    noResultsXPath: '//div[contains(@class, \'errorNotFoundPageMiddle-component\')]',
    zipcode: '',
  },
};
