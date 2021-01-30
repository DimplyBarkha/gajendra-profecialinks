
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'connection',
    domain: 'connection.com',
    url: 'https://www.connection.com/product/searchpage?SearchType=1&term={searchTerms}&pageNumber=1&pageSize=12&url=https%3A%2F%2Fwww.connection.com%2FIPA%2FShop%2FProduct%2FSearch&mode=List',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
