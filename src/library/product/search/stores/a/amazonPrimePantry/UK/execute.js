
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazonPrimePantry',
    domain: 'amazon.co.uk',
    url: 'https://www.amazon.co.uk/s/ref=nb_sb_noss?url=srs%3D5782660031%26search-alias%3Dpantry&field-keywords={searchTerms}&page=1',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
    zipcode: '10019',
  },
};
