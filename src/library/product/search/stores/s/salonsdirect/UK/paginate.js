
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'salonsdirect',
    nextLinkSelector: 'li.item.pages-item-next a.action.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products.wrapper.grid.products-grid',
    noResultsXPath: '//div[@class="message notice"]',
    openSearchDefinition: null,
    domain: 'salonsdirect.com',
    zipcode: '',
  },
};
