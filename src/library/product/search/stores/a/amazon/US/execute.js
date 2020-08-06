module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'div[class*="result-list"]>div[data-asin]>div>span[cel_widget_id="MAIN-SEARCH_RESULTS"]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
  },
};
