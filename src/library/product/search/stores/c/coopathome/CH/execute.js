
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'coopathome',
    domain: 'coop.ch',
    url: 'https://www.coop.ch/de/search/?text={searchTerms}',
    loadedSelector: 'ul.list-page__content',
    noResultsXPath: '//li[@data-onsite-search-category="Produkte" and contains(@class, "cmsOnPageSubNavi__menu-item cmsOnPageSubNavi__menu-item--disabled") ] | //h1[contains(text(),"Leider keine Treffer")]', 
    // noResultsXPath: '//h1[contains(text(),"Leider keine Treffer")]',
    zipcode: '',
  },
};
