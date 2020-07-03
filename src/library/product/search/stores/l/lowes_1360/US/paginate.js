
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes_1360',
    nextLinkSelector: 'li:last-child a.arrow',
    loadedSelector: 'a > span > article > span',
    domain: 'lowes.com',
  },
};
