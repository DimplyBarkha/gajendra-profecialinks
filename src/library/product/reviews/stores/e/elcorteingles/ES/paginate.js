
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'elcorteingles',
    nextLinkSelector: 'li[class*="item-next"]>a',
    mutationSelector: null,
    resultsDivSelector: '*[class*="content-list-reviews"]',
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
