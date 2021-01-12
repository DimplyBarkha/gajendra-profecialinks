
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'amazonPrimePantry',
    domain: 'amazon.in',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    // nextLinkXpath: null,
    // mutationSelector: null,
    spinnerSelector: 'div.s-result-list-placeholder:not(.aok-hidden)',
    // Use openSearchDefinition if nextLink has navigation issues.
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    // loadedXpath: null,
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.amazon.in/s?k={searchTerms}&i=pantry&ref=nb_sb_noss&page={page}',
    },
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[@cel_widget_id="MAIN-TOP_BANNER_MESSAGE" and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
    zipcode: '',
  },
};
