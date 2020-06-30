module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazonMweb',
    domain: 'amazon.fr',
    timeout: 9000,
    url: 'https://www.amazon.fr/s?k={searchTerms}',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    zipcode: '',
  },
};
