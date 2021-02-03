
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    spinnerSelector: 'div.s-result-list-placeholder:not(.aok-hidden)',
    // Use openSearchDefinition if nextLink has navigation issues.
    openSearchDefinition: {
      template: 'https://www.amazon.fr/s?k={searchTerms}&__mk_fr_FR=ÅMÅŽÕÑ&ref=nb_sb_noss_2&page={page}',
    },
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "Aucun résultat")] | /html[not(//div[contains(@data-component-type,"s-search-result") and @data-asin][not(contains(@class, "AdHolder"))])] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Vous recherchez une page")]',
    domain: 'amazon.fr',
    zipcode: '',
  },
};
