module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&i=amazonfresh&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
