
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: 'html body',
    noResultsXPath: '//div[@data-test="non-deliverable"]',
    zipcode: '',
  },
};
