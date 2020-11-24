
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes_1360',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={searchTerms}',
    loadedSelector: 'a > span > article > span',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")]',
    zipcode: '',
  },
};
