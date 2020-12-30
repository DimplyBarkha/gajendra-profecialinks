
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    domain: 'amazon.in',
    url: 'https://www.amazon.in/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[contains(@cel_widget_id, "MAIN-TOP_BANNER_MESSAGE") and contains(., "No results for")]',
    zipcode: '',
  },
};
