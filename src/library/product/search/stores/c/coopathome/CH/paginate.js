
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'coopathome',
    // nextLinkSelector: null,
    // nextLinkSelector: 'a[style="display: block;"]',
    // nextLinkSelector: 'span.list-page__trigger__text',
    loadedSelector: 'ul.list-page__content',
    noResultsXPath: '//h1[contains(text(),"Leider keine Treffer")]',
    domain: 'coop.ch',
    zipcode: '',
  },
};
