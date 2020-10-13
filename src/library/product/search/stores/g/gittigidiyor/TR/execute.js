
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'gittigidiyor',
    domain: 'gittigidiyor.com',
    url: `https://www.gittigidiyor.com/arama/?k={searchTerms}`,
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
