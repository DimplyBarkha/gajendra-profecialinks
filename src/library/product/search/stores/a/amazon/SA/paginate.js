
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")]',
    openSearchDefinition: null,
    domain: 'amazon.sa',
    zipcode: '',
  },
};
