
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparel',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/s?k={searchTerms}&i=clothing&ef=nb_sb_ss_i_1_6&dc',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
