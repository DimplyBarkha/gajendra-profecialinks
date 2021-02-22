
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'haarshop',
    nextLinkSelector: 'div.pages li.item.pages-item-next a.link.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.product-image-photo',
    noResultsXPath: '//div[contains(@class,"message notice")]//div',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'haarshop.nl',
    zipcode: '',
  },
};
