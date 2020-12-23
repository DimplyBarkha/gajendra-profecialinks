
module.exports = {
  // implements: 'navigation/goto',
  parameterValues: {
    domain: 'freshamazon.de',
    timeout: 60000,
    country: 'DE',
    store: 'freshamazon',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const inputUrl = `${url}`;
    await context.goto(inputUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    await context.waitForSelector('#nav-packard-glow-loc-icon');
    await context.click('#nav-packard-glow-loc-icon');
    await context.waitForSelector('input#GLUXZipUpdateInput');
    try {
      await context.click('a#GLUXChangePostalCodeLink');
    } catch (error) {
      console.log('Element not visible');
    }
    await context.setInputValue('input#GLUXZipUpdateInput', '10777');
    // await context.evaluate(async () => {
    //   // @ts-ignore
    //   document.querySelector('input#GLUXZipUpdateInput').value = '10777'
    // });
    await context.waitForSelector('#GLUXZipUpdate input');
    await context.click('#GLUXZipUpdate input');
    await context.waitForSelector('button[name="glowDoneButton"]');
    await context.click('button[name="glowDoneButton"]');
    await context.waitForNavigation({ timeout: 100000, waitUntil: 'load', checkBlocked: false });
  },
};