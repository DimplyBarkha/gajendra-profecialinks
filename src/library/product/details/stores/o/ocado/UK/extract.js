
const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    transform,
    domain: 'ocado.com',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(() => {
      if (document.querySelector('div.nf-resourceNotFound')) {
        throw new Error('Not a product Page');
      }

      const checkHeader = document.querySelector('div.bop-nutritionData__origin  table thead tr th');
      let caloriesPerServing = '';
      if (checkHeader) {
        const cal1 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(1) td:nth-child(2)').textContent.replace(/\//g, '');
        const cal2 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(2) td:nth-child(2)').textContent;
        caloriesPerServing = cal1 + ' / ' + cal2;
        console.log(caloriesPerServing);
      } else {
        const cal1 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(2) td:nth-child(2)').textContent.replace(/\//g, '');
        const cal2 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(3) td:nth-child(2)').textContent;
        caloriesPerServing = cal1 + ' / ' + cal2;
        console.log(caloriesPerServing);
      }
      const productName = document.querySelector('header.bop-title');
      if (productName) {
        productName.setAttribute('calories', caloriesPerServing);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
