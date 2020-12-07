module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&rh=p_89%3ALG&dc&qid=1602841162&rnid=2528832011&ref=sr_nr_p_89_3&dc',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
  },
};
