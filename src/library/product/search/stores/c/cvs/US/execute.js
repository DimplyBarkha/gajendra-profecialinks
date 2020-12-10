
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
    url: 'https://www.cvs.com/shop-assets/proxy/search?query={searchTerms}&skip=0&pageSize=50&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D',
    // loadedSelector: 'div.css-1dbjc4n.r-150rngu.r-14lw9ot.r-13awgt0.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-1oy2gb8.r-11yh6sk.r-1rnoaur.r-9aemit.r-1sncvnh',
    // noResultsXPath: '//div[contains(@class,"css-1dbjc4n r-ymttw5")]/h4[contains(.,"Sorry")]',
  },
};
