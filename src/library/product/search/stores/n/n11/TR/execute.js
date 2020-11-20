
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    domain: 'n11.com',
    url: 'https://www.n11.com/arama?q={searchTerms}&pg=1',
    // loadedSelector: '.listView>ul',
    noResultsXPath: null,
    zipcode: '',
  },
};
