module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    mutationSelector: 'span[cel_widget_id="UPPER-RESULT_INFO_BAR"] div>span[dir="auto"]:first-of-type',
    spinnerSelector: 'div.s-result-list-placeholder:not([class*="hidden"])',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    openSearchDefinition: {
      template: 'https://www.amazon.com/s?k={searchTerms}&ref=nb_sb_noss_2&page={page}',
    },
  },
};