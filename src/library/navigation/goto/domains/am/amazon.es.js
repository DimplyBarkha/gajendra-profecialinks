module.exports = {	module.exports = {
  extends: 'navigation/goto/domains/am/amazon',	  implements: 'navigation/goto',
  parameterValues: {	  parameterValues: {
    countryCode: 'ES',	    domain: 'amazon.es',
    // addressRegExp: /adresse/i,	    country: 'ES',
    // zipRegExp: /\b\d{5}\b/,	    store: 'amazon',
    zipcode: '',
  },	  },
}; 
