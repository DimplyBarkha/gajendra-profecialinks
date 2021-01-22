
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'Freshamazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Keine Ergebnisse")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.amazon.de/s?k={searchTerms}&i=amazonfresh&__mk_de_DE=ÅMÅŽÕÑ&ref=nb_sb_noss&page={page}'
    // },
    domain: 'amazon.de',
    zipcode: '10243',
  },
};
