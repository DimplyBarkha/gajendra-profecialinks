module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'amazon',
    domain: 'amazon.nl',
    url: 'https://www.amazon.nl/s?k={searchTerms}&__mk_it_IT=ÅMÅŽÕÑ&ref=nb_sb_noss_2&dc',
    loadedSelector: 'div[class*="result-list"]>div[data-asin]>div>span[cel_widget_id*="MAIN-SEARCH_RESULTS"]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "Nessun risultato")] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Cerchi qualcosa in particolare")]',
  },
};
