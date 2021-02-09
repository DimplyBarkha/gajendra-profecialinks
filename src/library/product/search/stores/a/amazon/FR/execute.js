
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    url: 'https://www.amazon.fr/s?k={searchTerms}&i=hpc&rh=n%3A197861031%2Cn%3A3786697031',
    loadedSelector: 'span[data-component-type="s-search-results"] div.s-main-slot',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE-0"  and contains(., "Aucun résultat pour ")]',
    zipcode: "''",
  },
};
