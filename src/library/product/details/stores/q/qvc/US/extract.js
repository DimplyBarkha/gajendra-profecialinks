const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    transform: cleanUp,
    domain: 'qvc.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    // open ingredients tab
    await context.evaluate(async function () {
      const buttonIngredients = document.querySelector('div[class*="accIngredients"] a[role="button"]');
      if (buttonIngredients) buttonIngredients.click();
    });
    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('availabilityText' in data[k].group[i]) {
          if (data[k].group[i].availabilityText[0].text.includes('In Stock')) {
            data[k].group[i].availabilityText[0].text = 'In Stock';
          }
          if (data[k].group[i].availabilityText[0].text.includes('not available')) {
            data[k].group[i].availabilityText[0].text = 'Out of Stock';
          }
        }
      }
    }
    return data;
  },
};
