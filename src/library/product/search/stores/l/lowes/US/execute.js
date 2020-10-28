
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={air cleaner}',
    loadedSelector: 'a > span > article > span',
    noResultsXPath: null,
  },
};
