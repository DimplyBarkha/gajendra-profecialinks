
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'dm',
    nextLinkSelector: 'button.bv-content-btn-pages-active',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-dmid="detail-image-slider-container"]',
    noResultsXPath: '//h1[contains(text(),"ergab leider keine Treffer")]',
    loadedXpath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.dm.de/p{id}.html?bvstate=pg:{page}/ct:r#review_root'
    // },
    domain: 'dm.de',
    zipcode: '',
  },
};
