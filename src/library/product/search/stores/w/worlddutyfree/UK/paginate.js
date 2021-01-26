
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    nextLinkSelector: "div[class='toolbar toolbar-products']:nth-child(2) div[class='pages'] ul[class='items pages-items'] li[class='item pages-item-next'] a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol[class="products list items product-items"]',
    noResultsXPath: '//div[@class="message notice"]/div',
    openSearchDefinition: null,
    domain: 'worlddutyfree.com',
    zipcode: '',
  },
};
