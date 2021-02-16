
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonPharmapacks',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&me=ASEVS99O6FS73&ref=nb_sb_noss&dc',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
