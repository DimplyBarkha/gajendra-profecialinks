
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'chemistdirect',
    nextLinkSelector: "li.nxt-pages-next a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#cd-main',
    noResultsXPath: "//div[@id='nxt-nrf']",
    openSearchDefinition: null,
    domain: 'chemistdirect.co.uk',
    zipcode: '',
  },
};
