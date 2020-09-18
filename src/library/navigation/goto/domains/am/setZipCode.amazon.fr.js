async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;

  const isZipCodePresent = await context.evaluate(async function () {
    let isZipCodePresent = document.querySelector('#glow-ingress-block');
    isZipCodePresent = isZipCodePresent ? isZipCodePresent.innerText.includes('75019') : '';
    return !!isZipCodePresent;
  });

  if (!isZipCodePresent) {
    await context.waitForSelector('#nav-packard-glow-loc-icon');
    await context.click('#nav-packard-glow-loc-icon');
    await context.waitForSelector('input#GLUXZipUpdateInput');
    try {
      await context.click('a#GLUXChangePostalCodeLink');
    } catch (error) {
      console.log('Element not visible');
    }
    await context.setInputValue('input#GLUXZipUpdateInput', zipcode);
    await context.waitForSelector('#GLUXZipUpdate input');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await context.click('#GLUXZipUpdate input');
    try {
      await context.waitForSelector('button[name="glowDoneButton"]');
      await context.click('button[name="glowDoneButton"]');
    } catch (error) {
      console.log('Done button not found');
    }
    await context.waitForNavigation();
  }
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'FR',
    domain: 'amazon.fr',
    timeout: 900000,
    store: 'amazonMweb',
    zipcode: '',
  },
};
