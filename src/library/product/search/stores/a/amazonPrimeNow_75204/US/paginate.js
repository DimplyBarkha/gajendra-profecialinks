
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow_75204',
    domain: 'primenow.amazon.com',
    nextLinkSelector: 'ul[class*="pagination-container"] > li:last-child > a[class*="buttons__prev-next-button"]:not([class*="buttons__disabled"])',
    spinnerSelector: 'div[class*="product_grid__disabledCover"]',
    loadedSelector: 'li[class^=product_grid__item]',
  },
};
