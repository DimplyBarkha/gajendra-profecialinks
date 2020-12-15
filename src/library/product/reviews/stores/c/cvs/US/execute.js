
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
    loadedSelector: 'div[class="css-1dbjc4n r-6koalj r-13awgt0 r-1mlwlqe r-eqz5dr r-1pi2tsx r-1wtj0ep r-dnmrzs r-q81ovl"] a',
    noResultsXPath: '//h4[contains(., "Sorry, we didn\'t find anything for")]',
    reviewUrl: 'https://www.cvs.com/search?searchTerm={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
