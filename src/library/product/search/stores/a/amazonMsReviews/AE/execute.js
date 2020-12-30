
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'amazon',
    domain: 'amazon.ae',
    url: 'https://www.amazon.ae/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin], section.ebx-empathy-x__body',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
