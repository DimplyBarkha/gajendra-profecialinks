
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'ebay',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.tpgv',
    noResultsXPath: '//div[@class="trc"]/span[contains(text(), "0")]',
    domain: 'ebay.de',
    zipcode: '',
  },
};
