
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'argos',
    domain: 'argos.ie',
    loadedSelector: null,
    noResultsXPath: '/html/body[not(contains(@class,"proddetails"))]',
    zipcode: '',
  },
};
