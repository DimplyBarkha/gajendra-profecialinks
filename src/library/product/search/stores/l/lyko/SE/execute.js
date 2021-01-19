
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'lyko',
    domain: 'lyko.com',
    url: 'https://lyko.com/sv/sok?q={searchTerms}&sortBy=popularity&count=150&infinitescroll=1',
    // url: 'https://lyko.com/sv/sok?q=after+shave',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
