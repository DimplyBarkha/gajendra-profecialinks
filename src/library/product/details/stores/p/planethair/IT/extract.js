const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    transform: cleanUp,
    domain: 'planethair.it',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 6000));

      var data = await context.extract(productDetails, { transform });
      for (let k = 0; k < data.length; k++) {
        for (let i = 0; i < data[k].group.length; i++) {
          if ('price' in data[k].group[i]) {
            data[k].group[i].price[0].text = data[k].group[i].price[0].text.replace('.', ',');
          }
          if ('description' in data[k].group[i]) {
            var descrString = data[k].group[i].description[0].text;
            descrString = descrString.split('Planethair.it:');
            descrString = descrString[0];
            descrString = descrString.split('Ingredienti');
            descrString = descrString[0];
            data[k].group[i].description[0].text = descrString;
          }
          if ('ingredientsList' in data[k].group[i]) {
            if (data[k].group[i].ingredientsList[0].text.includes('Ingredienti')) {
              var ingList = data[k].group[i].ingredientsList[0].text;
              ingList = ingList.split('Planethair.it:');
              ingList = ingList[0];
              ingList = ingList.split('Ingredienti');
              ingList = ingList[1];
              data[k].group[i].ingredientsList[0].text = ingList;
            } else {
              data[k].group[i].ingredientsList[0].text = '';
            }
          }
        }
      }
      return data;
  },
};
