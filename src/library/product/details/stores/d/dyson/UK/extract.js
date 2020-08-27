const { transform } = require('../../../../shared');
const { implementation } = require('../shared');
const productPageSelector = "//main//div[@class='par parsys']//div[contains(concat(' ',normalize-space(@class),' '),'product-hero')]//text()";
console.log(implementation({ productPageSelector }))

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'dyson',
    transform,
    domain: 'dyson.co.uk',
    zipcode: '',
  },
  implementation: implementation({ productPageSelector }),
};
