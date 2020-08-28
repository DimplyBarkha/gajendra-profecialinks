
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'ulta',
    domain: 'ulta.com',
    url: 'https://www.ulta.com/ulta/a/_/Ntt-{searchTerms}/Nty-1?ciSelector=searchResults',
    loadedSelector: 'div.productQvContainer',
    noResultsXPath: '//div[@class="no-result-lt"]/h2',
    zipcode: '',
  },
};
