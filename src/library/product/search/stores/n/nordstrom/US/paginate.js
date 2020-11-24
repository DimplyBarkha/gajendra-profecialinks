
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    nextLinkSelector: 'span._3xquK',
    loadedSelector: 'section article',
    noResultsXPath: '//h1[contains(text(),"No results for")] | //span[contains(text(),"Check the spelling or try a more general term.")]',
    domain: 'nordstrom.com',
  },
};
