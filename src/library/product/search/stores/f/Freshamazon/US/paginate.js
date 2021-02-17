
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'Freshamazon',
    domain: 'amazon.com',
    zipcode: '90210',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    // mutationSelector: 'span[cel_widget_id="UPPER-RESULT_INFO_BAR"] div>span[dir="auto"]:first-of-type',
    // spinnerSelector: 'div.s-result-list-placeholder:not([class*="hidden"])',
    openSearchDefinition: {
      template: 'https://www.amazon.com/s?k={searchTerms}&language=en_US&i=amazonfresh&ref=nb_sb_noss_2&page={page}',
    },
    loadedSelector: 'div[data-component-type*="s-search-result"][data-asin]',
    noResultsXPath: '//span[contains(text(),"No results for")]',
  },
};
