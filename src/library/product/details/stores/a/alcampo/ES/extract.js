const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    transform: cleanUp,
    domain: 'alcampo.es',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.evaluate(async () => {
      const body = document.querySelector('body');

      const isNutritionalInfoPresent = document.querySelector('div#producto_pestana_informacion_nutricion');
      if (isNutritionalInfoPresent) {
        body.setAttribute('servingsize', '100');
        body.setAttribute('servingunit', 'ml/g');
      }

      const addToCartButton = document.querySelector('div.addToCartDetail button[class*="big-button red-button"]');
      if (addToCartButton) {
        const isDisabled = addToCartButton.getAttribute('disabled');
        const availabilityValue = isDisabled ? 'Out Of Stock' : 'In Stock';
        body.setAttribute('availability', availabilityValue);
      }
    });

    var extractedData = await context.extract(productDetails, { transform });

    const rpc = extractedData[0].group[0].variantId;
    if (rpc) {
      rpc[0].text = rpc[0].text.replace(/\.(.+)/g, '');
    }

    const ingredientsList = extractedData[0].group[0].ingredientsList;
    if (ingredientsList) {
      ingredientsList[0].text = ingredientsList[0].text.replace(/Ingredientes:/g, '').trim();
    }

    const calories = extractedData[0].group[0].caloriesPerServing;
    if (calories && calories[0].text === ' | ') {
      calories[0].text = '';
    }

    const formatMineralPerServing = (path, regex) => {
      if (path) {
        path[0].text = path[0].text.match(regex) ? path[0].text.match(regex)[2] : '';
      }
    };
    const addUomFieldToMinerals = (valuePath, uomFieldName) => {
      if (valuePath) {
        extractedData[0].group[0][uomFieldName] = [
          {
            text: 'mg/L',
          },
        ];
      }
    };
    formatMineralPerServing(extractedData[0].group[0].sodiumPerServing, '([Ss]odio.+?)([0-9][0-9,.]+)');
    formatMineralPerServing(extractedData[0].group[0].calciumPerServing, '([Cc]alcio.+?)([0-9][0-9,.]+)');
    formatMineralPerServing(extractedData[0].group[0].magnesiumPerServing, '([Mm]agnesio.+?)([0-9][0-9,.]+)');
    addUomFieldToMinerals(extractedData[0].group[0].sodiumPerServing, 'sodiumPerServingUom');
    addUomFieldToMinerals(extractedData[0].group[0].calciumPerServing, 'calciumPerServingUom');
    addUomFieldToMinerals(extractedData[0].group[0].magnesiumPerServing, 'magnesiumPerServingUom');
  },
};
