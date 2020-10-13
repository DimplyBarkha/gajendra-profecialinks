
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsReviews',
    domain: 'amazon.es',
    url: 'https://www.amazon.es/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '//div[contains(@id,"review_list")  and not( //div[contains(@id,"customer_review")]) ]',
    zipcode: '',
  },
};
