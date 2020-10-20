const { implementation } = require('../am/amazon.com');

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'primenow.amazon.com',
    country: 'US',
    store: 'amazonPrimeNow',
  },
  implementation,
};
