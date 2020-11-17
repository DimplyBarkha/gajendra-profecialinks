
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    url: 'https://www.amazon.fr/s?k={searchTerms}&ref=nb_sb_noss&dc',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "Aucun résultat")] | /html[not(//div[contains(@data-component-type,"s-search-result") and @data-asin][not(contains(@class, "AdHolder"))])] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Vous recherchez une page")]',
  },
};
