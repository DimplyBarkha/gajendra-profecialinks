
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'US',
    store: 'electrictobacconist',
    nextLinkSelector: 'a[class="button alternate-reviews__next-page-button "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'electrictobacconist.com',
    zipcode: '',
  },
};
