
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    openSearchDefinition: {
      template: 'https://www.amazon.it/s?k={searchTerms}&__mk_it_IT=ÅMÅŽÕÑ&ref=nb_sb_noss_2&page={page}',
    },
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "Nessun risultato")] | /html[not(//div[contains(@data-component-type,"s-search-result") and @data-asin][not(contains(@class, "AdHolder"))])] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Cerchi qualcosa in particolare")]',
    domain: 'amazon.it',
    zipcode: '',
  },
};
