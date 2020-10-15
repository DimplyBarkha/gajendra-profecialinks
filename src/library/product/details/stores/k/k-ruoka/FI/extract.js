
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    transform,
    domain: 'k-ruoka.fi',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      var NutritionInfo = document.querySelector('div.shopping-list-product-details-container section.collapsible-container.product-nutritional-detail a');
      var table = document.querySelector('div.nutritional-contents'); 
      if (table) {
          document.body.append(table);
      }else if(!table && NutritionInfo) {
          console.log('clicking...');
          NutritionInfo.click();
          var table = document.querySelector('div.nutritional-contents'); 
          document.body.append(table);
      }
      
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
