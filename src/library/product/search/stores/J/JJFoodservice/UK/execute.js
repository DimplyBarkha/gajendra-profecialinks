
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'JJFoodservice',
    domain: 'jjfoodservice.com',
    url: 'https://www.jjfoodservice.com/search?b=BS-MW&page=0&q={searchTerms}&sortType=search',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
