module.exports = {	module.exports = {
  extends: 'navigation/goto/domains/am/amazon',	  implements: 'navigation/goto',
  parameterValues: {	  parameterValues: {
    countryCode: 'UK',	    country: 'UK',
    // addressRegExp: /address/i,	    domain: 'amazon.co.uk',
    // zipRegExp: /\b\d{5}\b/,	    store: 'amazon',
  },	  },
}; 
