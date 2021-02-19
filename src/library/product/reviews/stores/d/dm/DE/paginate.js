
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'dm',
    nextLinkSelector: null,
    // "span[class='bv-content-btn-pages-next']",
    nextLinkXpath: null,
    // '//li[contains(@class,"bv-content-pagination-buttons-item-next")]//a//span[@class="bv-content-btn-pages-next"]',
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
