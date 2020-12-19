const { transform } = require('./format');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AU',
    store: 'firstchoiceliquor',
    transform,
    domain: 'firstchoiceliquor.com.au',
    zipcode: "''",
  },
};
