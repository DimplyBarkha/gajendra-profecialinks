
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    openSearchDefinition: {
      template: 'https://www.amazon.es/s?k={searchTerms}&__mk_es_ES=ÅMÅŽÕÑ&ref=nb_sb_noss_2&page={page}',
    },
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No hay resultados")] | /html[not(//div[contains(@data-component-type,"s-search-result") and @data-asin][not(contains(@class, "AdHolder"))])]',
    domain: 'amazon.es',
    zipcode: '',
  },
};
