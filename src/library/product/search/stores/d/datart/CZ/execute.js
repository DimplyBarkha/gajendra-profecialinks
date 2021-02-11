module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CZ',
    store: 'datart',
    domain: 'datart.cz',
    url: 'https://www.datart.cz/vyhledavani/index.html?q="{searchTerms}"',
    loadedSelector: 'div #fulltext-results',
    noResultsXPath: null,
    zipcode: '',
  },
};

//* *************************** */
// module.exports = {
//   implements: 'product/search/execute',
//   parameterValues: {
//     country: 'CZ',
//     store: 'datart',
//     domain: 'datart.cz',
//     url: null,
//     loadedSelector: null,
//     noResultsXPath: null,
//     zipcode: '',
//   },
// };
