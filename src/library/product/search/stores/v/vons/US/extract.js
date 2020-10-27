const { cleanUp } = require('../../../../shared');
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'US',
store: 'vons',
transform: cleanUp,
domain: 'vons.com',
zipcode: '',
},
};