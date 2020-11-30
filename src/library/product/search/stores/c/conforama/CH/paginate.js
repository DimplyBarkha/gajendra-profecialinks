
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    nextLinkSelector: 'div.ctrl-next a',
    loadedSelector: 'div.contentProducts',
    // 'section[class="main-section"], form[id="productSheet"]',
    noResultsXPath: '//section[contains(@class,"emptySearch")]',
    // openSearchDefinition: {
    //   template: 'https://www.conforama.ch/de/recherche-conforama/{searchTerms}?p={page}',
    // },
    domain: 'conforama.ch',
    zipcode: '',
  },
};
