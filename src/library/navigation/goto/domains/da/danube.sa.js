
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'danube.sa',
    timeout: 60000,
    country: 'SA',
    store: 'danube',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setUseRelayProxy(false);

    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }

    // Wait for the pop up button element to load
    try{
      await context.waitForSelector('button.d-store-selector__apply-btn.btn.btn-primary.btn-block', { timeout: 10000 });
    } catch(e) {
      console.log('Store selector pop up is not clicked');
    }

    // If cookie pop up appears then clicking on accept button
    let isButtonClicked = false;
    await context.evaluate(async function (isButtonClicked) {
      const storeButtonSelector = document.querySelector('button.d-store-selector__apply-btn.btn.btn-primary.btn-block');
      if (storeButtonSelector && storeButtonSelector.click()) isButtonClicked=true;
      return;
    }, isButtonClicked);

    if (isButtonClicked) await context.waitForNavigation({ timeout: 20000, waitUntil: 'load' });
  },
};
