module.exports = {	module.exports = {
  extends: 'navigation/goto/domains/am/amazon',	  implements: 'navigation/goto',
  parameterValues: {	  parameterValues: {
    countryCode: 'FR',	    domain: 'amazon.fr',
    // addressRegExp: /address/i,	    country: 'FR',
    // zipRegExp: /\b\d{5}\b/,	    store: 'amazon',
    zipcode: '', 
  },	  },
};
