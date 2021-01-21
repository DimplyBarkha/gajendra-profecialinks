
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'instacart.com',
    store: 'instacart',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { zipcode } = inputs;

    async function changeLocation (zipcode) {
      await context.click('div[data-identifier="availability_chooser"] button');
      await context.waitForSelector('div[data-identifier="availability_chooser"] button[aria-expanded="true"]', { timeout: 15000 });
      // await context.setInputValue('div#location-chooser input', zipcode);
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await context.evaluate(async function (zipcode) {
        const button = document.querySelector('div#location-chooser input');
        if (button) {
          button.value = zipcode;
          button.click();
        }
      }, zipcode);
      await new Promise((resolve) => setTimeout(resolve, 35000));
      await context.click('div[data-identifier="availability_chooser"] button[data-arrow-navigation="true"]');
      context.waitForNavigation();
    }
    const changedLocationZipCode = await context.evaluate(function () {
      return document.querySelector('div[data-identifier="availability_chooser"] button span') ? document.querySelector('div[data-identifier="availability_chooser"] button span').textContent : '';
    });

    if (changedLocationZipCode != zipcode) {
      await changeLocation(zipcode);
    }
  },
};
