
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'amazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    mutationSelector: null,
    spinnerSelector: 'div.s-result-list-placeholder:not(.aok-hidden)',
    // Use openSearchDefinition if nextLink has navigation issues.
    openSearchDefinition: {
      template: 'https://www.amazon.com.au/s?k={searchTerms}&ref=nb_sb_noss_2',
    },
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "Nessun risultato")] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Cerchi qualcosa in particolare")]',
    domain: 'amazon.com.au',
  },
};
