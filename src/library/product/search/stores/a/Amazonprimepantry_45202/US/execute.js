
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'Amazonprimepantry_45202',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s/?srs=7301146011&rh=i:pantry&keywords={searchTerms}&page=1',
    loadedSelector: 'div[data-asin]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
