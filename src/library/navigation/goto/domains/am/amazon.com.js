module.exports = {
  extends: 'navigation/goto/domains/am/amazon',
  parameterValues: {
    countryCode: 'US',
    addressRegExp: /address/i,
    zipRegExp: /\b\d{5}\b/,
  },
};
