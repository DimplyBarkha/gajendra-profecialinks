
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/s?k={searchTerms}&ref=nb_sb_noss_2',
    loadedSelector: 'span[data-component-type="s-search-results"] div.s-main-slot',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE-0"  and contains(., "Keine Ergebnisse für ")]',
    zipcode: "''",
  },
};
