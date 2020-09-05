module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'davidjones',
    domain: 'davidjones.com',
    url: 'https://search.www.davidjones.com/search?w={searchTerms}',
    loadedSelector: 'div#sli_content_wrapper',
    noResultsXPath: 'div.sli_no_results_text',
    zipcode: '',
  },
};
