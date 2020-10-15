
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    domain: 'littlewoods.com',
    url: 'https://www.littlewoods.com/e/q/{searchTerms}.end?_requestid={id}',
    loadedSelector: '#products>ul',
    noResultsXPath: null,
    zipcode: '',
  },
};
