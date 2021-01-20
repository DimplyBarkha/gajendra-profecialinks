
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'LV',
    store: 'barbora',
    nextLinkSelector: null,
    nextLinkXpath: '//div[contains(@class, "b-pagination-wrapper--desktop-top")]/ul[@class="pagination"]//li[@class="active"]/following-sibling::li[position() < last()]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.b-products-list--wrapper div.b-products-list div.b-product--wrap2',
    noResultsXPath: '//div[@class="b-warning"]',
    openSearchDefinition: null,
    domain: 'barbora.lv',
    zipcode: '',
  },
};
