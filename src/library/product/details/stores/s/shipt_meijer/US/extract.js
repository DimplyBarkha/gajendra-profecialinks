const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'shipt_meijer',
    transform: cleanUp,
    domain: 'shop.shipt.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData(data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `added-product-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }

      async function showMore(selector) {
        if (document.querySelector(selector)) {
          // @ts-ignore
          await document.querySelector(selector).click();
        }
      }

      function getNutrients(name, array) {
        const element = array.find(el => el.innerText.includes(name));
        let amount = '';
        let uom = '';
        if (element && element.match(/(\d+(.]d+)?)/)) {
          amount = element.match(/(\d+(.\d+)?)/)[1].trim();
        }
        if (element && element.match(/(\d+(.\d+)?)(\D+)/)) {
          uom = element.match(/(\d+(.\d+)?)(\D+)/)[3].trim();
        }
        return [amount, uom];
      }

      await showMore('div[data-test="ProductDetail-product-description"] button');
      await showMore('div[data-test="ProductDetail-product-ingredients"] button');
      await showMore('section[data-test="ProductDetail-disclaimer"] button');

      const data = {};
      data.url = window.location.href;
      data.id = window.location.href.match(/products\/(.*)$/)[1];
      data.availability = document.querySelector('button[aria-label="Add to cart"]') ? 'In Stock' : 'Out Of Stock';
      const prices = document.querySelectorAll('div[data-test="ProductDetail-product-sale-price"] > span');
      if (prices.length === 2) {
        data.price = prices[0].textContent;
        data.listPrice = prices[1].textContent;
      } else {
        data.price = document.querySelector('div[class*="mr2 title-1"]')
          ? document.querySelector('div[class*="mr2 title-1"]').textContent : '';
      }
      data.legal = '';
      document.querySelectorAll('section[data-test="ProductDetail-disclaimer"] > div > div').forEach(el => { data.legal += el.textContent; });
      data.legal = data.legal.replace(/\n/g, '').trim();
      // try
      const nutrientsTable = document.querySelector('shipt-nutrition-label').shadowRoot.querySelector('shipt-normal-nutrition-label').shadowRoot.querySelector('div');
      const serving = nutrientsTable.querySelector('div.serving-size') ? nutrientsTable.querySelector('div.serving-size').textContent.replace('Serving Size', '').trim() : '';
      if (serving) data.servingSize = serving.match(/(\d+(.\d{2})?)/) ? serving.match(/(\d+(.\d{2})?)/)[1] : '';
      if (serving) data.servingSizeUom = serving.match(/(\w+)$/) ? serving.match(/(\w+)$/)[1] : '';
      const servingsPer = nutrientsTable.querySelector('div.servings-per-container') ? nutrientsTable.querySelector('div.servings-per-container').textContent : '';
      if (servingsPer) data.servingsPer = servingsPer.match(/\d+/) ? servingsPer.match(/\d+/)[0] : '';
      data.calories = nutrientsTable.querySelector('div.calories-count') ? nutrientsTable.querySelector('div.calories-count').textContent.replace('Calories', '').trim() : '';
      // @ts-ignore
      const nutrientArray = [...nutrientsTable.querySelectorAll('div.nutrients > div[class*=nutrient]')].map(el => el.innerText);
      [data.totalFat, data.totalFatUom] = getNutrients('Total Fat', nutrientArray);
      [data.saturatedFat, data.saturatedFatUom] = getNutrients('Saturated Fat', nutrientArray);
      [data.transFat, data.transFatUom] = getNutrients('Trans Fat', nutrientArray);
      [data.cholesterol, data.cholesterolUom] = getNutrients('Cholesterol', nutrientArray);
      [data.sodium, data.sodiumUom] = getNutrients('Sodium', nutrientArray);
      [data.totalCarb, data.totalCarbUom] = getNutrients('Total Carbohydrate', nutrientArray);
      [data.dietFiber, data.dietFiberUom] = getNutrients('Dietary Fiber', nutrientArray);
      [data.sugars, data.sugarsUom] = getNutrients('Sugars', nutrientArray);
      [data.protein, data.proteinUom] = getNutrients('Protein', nutrientArray);
      // @ts-ignore
      const mineralsArray = [...nutrientsTable.querySelectorAll('div.minerals > div[class*=nutrient]')].map(el => el.innerText);
      [data.vitA, data.vitAUom] = getNutrients('Vitamin A', mineralsArray);
      [data.vitC, data.vitCUom] = getNutrients('Vitamin C', mineralsArray);
      [data.calcium, data.calciumUom] = getNutrients('Calcium', mineralsArray);
      [data.iron, data.ironUom] = getNutrients('Iron', mineralsArray);
      [data.magnesium, data.magnesiumUom] = getNutrients('Magnesium', mineralsArray);
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
