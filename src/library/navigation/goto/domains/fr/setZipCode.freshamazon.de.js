
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'DE',
    domain: 'freshamazon.de',
    store: 'freshamazon',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    // await context.goto(url);
    await context.waitForNavigation();
    await context.waitForSelector('#nav-packard-glow-loc-icon');
    await context.click('#nav-packard-glow-loc-icon');
    await context.waitForSelector('input#GLUXZipUpdateInput');
    try {
      await context.click('a#GLUXChangePostalCodeLink');
    } catch (error) {
      console.log('Element not visible');
    }
    await context.setInputValue('input#GLUXZipUpdateInput', '10779');
    // await context.evaluate(async () => {
    //   // @ts-ignore
    //   document.querySelector('input#GLUXZipUpdateInput').value = '10777'
    // });
    await context.waitForSelector('#GLUXZipUpdate input');
    await context.click('#GLUXZipUpdate input');
    await context.waitForSelector('button[name="glowDoneButton"]');
    await context.click('button[name="glowDoneButton"]');
    await context.waitForNavigation();
  },
};