
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    domain: 'davidjones.com',
    url: 'https://search.www.davidjones.com/search?w={searchTerms}',
    loadedSelector: '#page-content',
    noResultsXPath: 'div.sli_no_results_text',
    zipcode: '',
  },
};
