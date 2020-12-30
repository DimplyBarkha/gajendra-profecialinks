
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'amazon',
    domain: 'amazon.sa',
    url: 'https://www.amazon.sa/s?k={searchTerms}&language=en&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")]',
    zipcode: '',
  },
};
