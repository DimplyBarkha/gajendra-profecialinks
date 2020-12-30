
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[contains(@cel_widget_id, "MAIN-TOP_BANNER_MESSAGE") and contains(., "Nessun risultato per")]',
    openSearchDefinition: null,
    domain: 'amazon.it',
    zipcode: '20019',
  },
};
