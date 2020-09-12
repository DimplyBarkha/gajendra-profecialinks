
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    nextLinkSelector: 'div.pagination > ul > li.current-page + li > a[data-track-event="Link Click"]',
    loadedSelector: 'body',
    noResultsXPath: 'div.sli_no_results_text',
    // openSearchDefinition: {
    //   template: 'https://www.shavershop.com.au/search?q={searchTerms}&start={page}&sz=32',
    // },
    domain: 'shavershop.com.au',
    zipcode: '',
  },
};
