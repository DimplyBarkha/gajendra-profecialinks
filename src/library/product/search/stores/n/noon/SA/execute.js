module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    domain: 'noon.com',
    url: 'https://www.noon.com/saudi-en/search?q={searchTerms}',
    loadedSelector: 'div.jsx-3152181095 .productList .gridView',
    noResultsXPath: '//div[@class="jsx-671104679 jsx-3349621030 container"]',
    zipcode: "''",
  },
};