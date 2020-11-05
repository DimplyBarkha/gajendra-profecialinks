module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.sa',
    url: 'https://www.amazon.sa/s?k={searchTerms}&ref=nb_sb_noss',
    loadedSelector: 'section.ebx-empathy-x__body',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    zipcode: '',
  },
};
