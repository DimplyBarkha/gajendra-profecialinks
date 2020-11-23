const { transform } = require('../../../../shared');
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'DE',
store: 'durstexpress',
transform: transform,
domain: 'durstexpress.de',
zipcode: ''
},

};
