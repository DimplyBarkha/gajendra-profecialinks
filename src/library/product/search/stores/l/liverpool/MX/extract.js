const { transform } = require('../../../../shared');
module.exports = {
implements: 'product/search/extract',
parameterValues: {
country: 'MX',
store: 'liverpool',
transform: transform,
domain: 'liverpool.mx',
},
};