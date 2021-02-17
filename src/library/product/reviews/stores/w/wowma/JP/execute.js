
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'JP',
    store: 'wowma',
    domain: 'wowma.jp',
    loadedSelector: 'section#lotReviewContents',
    noResultsXPath: '//div[contains(@class,"NoResultPage")]',
    reviewUrl: 'https://wowma.jp/items/{id}/reviews?order=created_desc',
    sortButtonSelectors: null,
    zipcode: '',
  },
};


