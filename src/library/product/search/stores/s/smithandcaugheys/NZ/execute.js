
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'smithandcaugheys',
    domain: 'smithandcaugheys.co.nz',
    url: 'https://www.smithandcaugheys.co.nz/search.aspx?q={searchTerms}',
    loadedSelector: 'article[data-productid]',
    noResultsXPath: '//div[contains(text(),"Sorry no results found")]',
    zipcode: '',
  },
};
