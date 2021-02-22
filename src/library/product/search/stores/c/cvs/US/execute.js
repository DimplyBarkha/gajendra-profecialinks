
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
    url: 'https://www.cvs.com/search?searchTerm={searchTerms}',
    loadedSelector: 'div.css-1dbjc4n.r-150rngu.r-14lw9ot.r-13awgt0.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-1oy2gb8.r-11yh6sk.r-1rnoaur.r-9aemit.r-1sncvnh , ul.gb-list__wrapper.gb-list__wrapper--grid',
    noResultsXPath: '//div[contains(@class,"css-1dbjc4n r-1kihuf0 r-1777fci r-ymttw5 r-9bullz")]/h4[contains(.,"Sorry")]',
  },
};
