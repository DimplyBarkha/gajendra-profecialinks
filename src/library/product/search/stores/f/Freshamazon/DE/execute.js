
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'Freshamazon',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/s?k={searchTerms}&i=amazonfresh&__mk_de_DE=ÅMÅŽÕÑ&ref=nb_sb_noss&dc',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "Keine Ergebnisse")] | /html[not(//div[contains(@data-component-type,"s-search-result") and @data-asin][not(contains(@class, "AdHolder"))])] | //img[contains(@alt,"Dogs of Amazon")]  | //*[contains(text(),"Suchen Sie bestimmte Informationen")]',
    zipcode: '10243',
  },
};
