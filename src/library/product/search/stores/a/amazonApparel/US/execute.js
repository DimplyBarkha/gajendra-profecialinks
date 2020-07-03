module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonApparel',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/s?k={searchTerms}&i=specialty-aps&srs=7472647011&crid=39TQ8JHSLS49U',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")]',
  },
};
