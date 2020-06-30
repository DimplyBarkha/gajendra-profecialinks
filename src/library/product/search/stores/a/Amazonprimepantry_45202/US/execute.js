
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'Amazonprimepantry_45202',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&i=pantry&ref=nb_sb_noss_2',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    zipcode: '45202',
  },
};
