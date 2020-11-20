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

    await context.evaluate(async () => {
      // add rank attribute
      var brand = document.querySelector('div[class="brand"] a').innerText;
      brand = brand.replace(' ', '-');
      const element = document.createElement('a');
      element.id = "brandLink";
      element.href = 'https://www.planethair.it/' + brand;
      element.style.display = 'none';
      document.body.appendChild(element);
    });

      var data = await context.extract(productDetails, { transform });
      for (let k = 0; k < data.length; k++) {
        for (let i = 0; i < data[k].group.length; i++) {
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
