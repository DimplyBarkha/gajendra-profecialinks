
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    // nextLinkSelector: 'button.paginator-btn.paginator-btn-next',
    // nextLinkSelector: '[class="paginator-list"] > li.active+li > button',
    // spinnerSelector: 'div.sar-filter-result-loading',
    loadedSelector: '[itemprop="review"]',
    noResultsXPath: '//div[@class="no-wyr-product-review-rounded-overall"][text()="0"] | //div[@class="error-message-margin error-page-message"]|//*[contains(@class,"product-review-first-review-text")]',
    openSearchDefinition: {
      template: 'https://www.walmart.com/reviews/product/44805491?page={page}&sort=submission-desc',
    },
    pageCheckSelector: 'button.active',
    domain: 'walmart.com',
    zipcode: '',
  },
};
