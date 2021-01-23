
module.exports = {
<<<<<<< HEAD
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'amazon.com.mx',
    timeout: null,
    country: 'MX',
    store: 'amazon',
    zipcode: '',
=======
  extends: 'navigation/goto/domains/am/amazon',
  parameterValues: {
    domain: 'amazon.com.mx',
    country: 'MX',
    store: 'amazon',
    timeout: 90000,
>>>>>>> bab5e9660a1bf92fee78ef0923e7cc6f6cdec1d9
  },
};
