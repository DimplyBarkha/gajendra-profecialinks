
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    domain: 'amazon.in',
    url: 'https://www.amazon.in/s?k={searchTerms}&ref=nb_sb_noss_2&dc',
    loadedSelector: 'div[data-asin], section.ebx-empathy-x__body',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
    zipcode: '',
  },
};