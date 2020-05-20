module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    domain: 'groceries.asda.com',
    store: 'asda',
    nextLinkSelector: 'button[aria-label="next page"] > span:not(.asda-icon--gray)',
    mutationSelector: 'main',
  },
};
