
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'danmurphys',
    domain: 'danmurphys.com.au',
    url: 'https://www.danmurphys.com.au/search?searchTerm={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//p[contains(text()," Try checking your spelling for errors, ")]',
    zipcode: "''",
  },
};