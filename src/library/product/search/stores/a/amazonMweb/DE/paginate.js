
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'amazonMweb',
    timeout: 8000,
    nextLinkSelector: 'ul.a-pagination > li.a-last a',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    openSearchDefinition: null,
    domain: 'amazon.de',
    zipcode: '',
  },
};
