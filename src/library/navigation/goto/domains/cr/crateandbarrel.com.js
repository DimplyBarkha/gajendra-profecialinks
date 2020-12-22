
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'crateandbarrel.com',
    timeout: 100000,
    store: 'crateandbarrel',
    country: 'US',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      const isUS = await context.evaluate(async function () {
        const element = document.querySelector('li#header-country-flag button img');
        if (element && element.alt && element.alt.includes('United States')) {
          return true;
        } else {
          return false;
        }
      });
      console.log('Country is US :  ', isUS);
      if (!isUS) {
        await context.waitForSelector('li#header-country-flag button');
        await context.click('li#header-country-flag button');
        await context.waitForSelector('#shipping-select-container label[for="us-select"]');
        await context.click('#shipping-select-container label[for="us-select"]');
        await context.waitForSelector('#btn-ship-to-international');
        await context.click('#btn-ship-to-international');
        await context.waitForNavigation();
      }
    } catch (error) {
      console.log('Failed to change country');
    }

    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
