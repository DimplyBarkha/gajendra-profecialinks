
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
          const cal1 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(1) td:nth-child(2)')
          && document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(1) td:nth-child(2)').textContent.replace(/\//g, '');
          const cal2 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(2) td:nth-child(2)')
          && document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(2) td:nth-child(2)').textContent;
          caloriesPerServing = cal1 + ' / ' + cal2;
      
      } else {
          const cal1 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(2) td:nth-child(2)')
          && document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(2) td:nth-child(2)').textContent.replace(/\//g, '');
          const cal2 = document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(3) td:nth-child(2)')
          && document.querySelector('div.bop-nutritionData__origin  table tr:nth-child(3) td:nth-child(2)').textContent;
          caloriesPerServing = cal1 + ' / ' + cal2;
      
      }
      
      var checkcaloriesPerServing = caloriesPerServing.match(/(\d+)\s?g/g);
      if (checkcaloriesPerServing || checkcaloriesPerServing === null) {
          caloriesPerServing = caloriesPerServing.replace(/(.+)(kJ)\s?\s?(.+)(kcal)(.+)/g, '$1$2/$3$4')
      
      }
      const productName = document.querySelector('header.bop-title');
      if (productName) {
          productName.setAttribute('calories', caloriesPerServing.replace(/(.+)(kJ)(.+)(kcal)/g, '$1$2/$3$4').replace('(', ' / ').replace('(.+)(kJ)\s?\s?(.+)(kcal)(.+)', '$1$2/$3$4').replace('//', ' / ').replace(' / /', ' / ').replace('/ /', ' / ').replace('null / null', ''));
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
