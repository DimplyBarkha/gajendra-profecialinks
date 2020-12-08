
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'US',
    store: 'vusevapor',
    nextLinkSelector: '#customer-reviews > div.block-content > div:nth-child(3) > div > div.pages > ul > li.item.pages-item-next > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li[class="item review-item"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'vusevapor.com',
    zipcode: '',
  },
};
