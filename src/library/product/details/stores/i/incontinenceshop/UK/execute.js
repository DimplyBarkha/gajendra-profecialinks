
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    domain: 'incontinenceshop.com',
    loadedSelector: null,
    noResultsXPath: '//div[contains(text(),"no results")]',
    zipcode: '',
  },
};
