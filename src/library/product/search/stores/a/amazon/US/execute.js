module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin], section.ebx-empathy-x__body',
    noResultsXPath: '//span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")]',
  },
};
