
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    nextLinkSelector: 'div[class*="bottom"] span[class*="is-next"] >a>span',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-zone="OFFERBOX_PHOTO"]>a>img',
    noResultsXPath: '//div[contains(@class,"noResults")]//p[1]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'mediaexpert.pl',
  },
};
