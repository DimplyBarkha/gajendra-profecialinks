module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    nextLinkSelector: null,
    nextLinkXpath: '//div[@class="pagenav"]//tr//td//a[contains(text(),">")]',
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: null,
    loadedSelector: 'div[id="product-list"] form',
    domain: 'medpex.de',
  },
};
