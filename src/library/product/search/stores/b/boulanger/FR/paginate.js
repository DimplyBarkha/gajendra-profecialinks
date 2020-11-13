
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    nextLinkSelector: 'span[class="navPage navPage-right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productListe',
    noResultsXPath: '//div[@itemprop="mainContentOfPage"][contains(text(), "0")] | //h1[contains(text(), "Access Denied")]',
    openSearchDefinition: null,
    domain: 'boulanger.com',
    zipcode: '',
  },
};
