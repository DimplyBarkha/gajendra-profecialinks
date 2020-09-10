
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    nextLinkSelector: '.page-next',    
    loadedSelector: '.search-result-content',
    noResultsXPath: 'div.sli_no_results_text',
    domain: 'shavershop.com.au',
    zipcode: '',
  },
};
