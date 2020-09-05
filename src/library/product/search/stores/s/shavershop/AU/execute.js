
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    domain: 'shavershop.com.au',
    loadedSelector: 'body',
    noResultsXPath: 'div.sli_no_results_text',
    url: 'https://www.shavershop.com.au/search?q={searchTerms}',
    zipcode: '',
  },
};
