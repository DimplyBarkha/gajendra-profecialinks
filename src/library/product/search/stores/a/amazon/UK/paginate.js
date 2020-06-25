
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    nextLinkSelector: 'ul.a-pagination > li.a-last a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    openSearchDefinition: null,
    domain: 'amazon.co.uk',
  },
};
