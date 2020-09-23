
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    domain: 'amazon.it',
    url: 'https://www.amazon.it/s?k={searchTerms}&__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[contains(@cel_widget_id, "MAIN-TOP_BANNER_MESSAGE") and contains(., "Nessun risultato per")]',
    zipcode: '20019',
  },
};
