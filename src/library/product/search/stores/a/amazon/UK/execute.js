
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    domain: 'amazon.co.uk',
    zipcode: 'SW1P 3EU',
    url: 'https://www.amazon.co.uk/s?k={searchTerms}&ref=nb_sb_noss',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
