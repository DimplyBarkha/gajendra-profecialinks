
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparelApp',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/s?k={searchTerms}&i=drugstore&__mk_de_DE=ÅMÅŽÕÑ&ref=nb_sb_noss_1',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
