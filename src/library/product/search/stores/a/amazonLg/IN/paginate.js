
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'amazonLg',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.in',
    zipcode: '',
  },
};

// module.exports = {
//   implements: 'product/search/paginate',
//   parameterValues: {
//     country: 'IN',
//     store: 'amazonLg',
//     domain: 'amazon.in',
//     nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
//     spinnerSelector: 'div.s-result-list-placeholder:not(.aok-hidden)',
//     // Use openSearchDefinition if nextLink has navigation issues.
//     loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
//     openSearchDefinition: {
//       template: 'https://amazon.in/s?k={searchTerms}&rh=p_89%3ALG&dc&qid=1602841162&rnid=2528832011&ref=sr_nr_p_89_3&page={page}',
//     },
//     noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "Search"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
//   },
// };

