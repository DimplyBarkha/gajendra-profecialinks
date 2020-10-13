module.exports = {	module.exports = {
  extends: 'navigation/goto/domains/am/amazon',	  implements: 'navigation/goto',
  parameterValues: {	  parameterValues: {
    countryCode: 'IT',	    country: 'IT',
    // addressRegExp: /address/i,	    domain: 'amazon.it',
    // zipRegExp: /\b\d{5}\b/,	    store: 'amazon',
  },	  },
}; 
