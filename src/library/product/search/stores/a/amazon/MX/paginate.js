
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'amazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    spinnerSelector: 'div.s-result-list-placeholder:not(.aok-hidden)',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    openSearchDefinition: {
      template: 'https://www.amazon.com.mx/s?k=%7BsearchTerms%7D&__mk_es_MX=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss',
    },
    noResultsXPath: '//a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //span[contains(@cel_widget_id,"MAIN-TOP_BANNER_MESSAGE") and contains(., "No results")] | /html[not(//div[contains(@data-component-type,"s-search-result") and @data-asin][not(contains(@class, "AdHolder"))])] | //img[contains(@alt,"Dogs of Amazon")] |//*[contains(text(),"Looking for something?")]',
  },
};

// nextLinkXpath: null,
    // mutationSelector: null,
      // loadedXpath: null,
    
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
     //domain: 'amazon.com.mx',
    // zipcode: '',
