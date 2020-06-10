
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
    url: 'https://www.cvs.com/search?searchTerm={searchTerms}',
    loadedSelector: 'div.css-1dbjc4n.r-150rngu.r-14lw9ot.r-13awgt0.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-1oy2gb8.r-11yh6sk.r-1rnoaur.r-9aemit.r-1sncvnh',
    noResultsXPath: '//div[contains(@class,"css-1dbjc4n r-ymttw5")]/h4[contains(.,"Sorry")]',
  },
};
