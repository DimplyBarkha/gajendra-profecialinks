
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&ref=nb_sb_noss',
    loadedSelector: 'div[data-asin]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
