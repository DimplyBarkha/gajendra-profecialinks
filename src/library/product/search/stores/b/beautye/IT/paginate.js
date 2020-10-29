
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    // nextLinkSelector: '#amasty-shopby-product-list > div:nth-child(4) > div.pages > ul > li.item.pages-item-next > a',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.products-grid', // 'li.item.product.product-item',
    noResultsXPath: '//div[@class="message notice"]/div',
    // openSearchDefinition: null,
    openSearchDefinition: {
      template: 'https://www.beautye.it/search/{searchTerms}?p={page}',
    },
    domain: 'beautye.it',
    zipcode: '',
  },
};
