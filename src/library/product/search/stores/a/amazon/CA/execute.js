
module.exports = {
  implements: 'product/search/execute',
  extends: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    domain: 'amazon.ca',
    url: 'https://www.amazon.ca/s?k={searchTerms}&ref=nb_sb_noss_2&dc',
    loadedSelector: 'div[class*="result-list"]>div[data-asin]>div>span[cel_widget_id*="MAIN-SEARCH_RESULTS"]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
  },
};
