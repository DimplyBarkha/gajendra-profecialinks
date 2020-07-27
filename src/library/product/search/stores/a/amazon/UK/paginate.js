
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    openSearchDefinition: {
      template: 'https://www.amazon.co.uk/s?k={searchTerms}&ref=nb_sb_noss_2&page={page}',
    },
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")] | /html[not(//div[contains(@data-component-type,"s-search-result") and @data-asin][not(contains(@class, "AdHolder"))])] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
    domain: 'amazon.co.uk',
    zipcode: '',
  },
};
