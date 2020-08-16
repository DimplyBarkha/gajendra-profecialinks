
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="content"]',
    // loadedSelector: 'div.category-products > ul > li:not([class="no-hover"])',
    // openSearchDefinition: {
    //   template: 'https://www.flaconi.de/search/?q={searchTerms}',
    // },
    domain: 'flaconi.de',
  },
};
