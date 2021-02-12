
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    domain: 'shop-apotheke.com',
    loadedSelector: null,
    noResultsXPath: `//h1[@class='p-error-headline']`,
    reviewUrl: 'https://www.shop-apotheke.com/produktbewertungen/{id}/.htm#user-reviews-section',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
