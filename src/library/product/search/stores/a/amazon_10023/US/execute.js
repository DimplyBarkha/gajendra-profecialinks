
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon_10023',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-component-type="s-search-result"][data-asin]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    zipcode: '10023',
  },
};
