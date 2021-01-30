
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    domain: 'amazon.it',
    loadedSelector: 'div#cm_cr-review_list',
    noResultsXPath: '//td[@valign="middle"]/b[contains(text(),"Cerchi qualcosa in particolare?")]',
    reviewUrl: 'https://www.amazon.it/product-reviews/{id}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
