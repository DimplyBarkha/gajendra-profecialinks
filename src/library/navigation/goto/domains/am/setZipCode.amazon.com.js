async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  const isZipCodePresent = await context.evaluate(async function () {
    let isZipCodePresent = document.querySelector('#glow-ingress-block');
    isZipCodePresent = isZipCodePresent ? isZipCodePresent.innerText.includes('New York 10023') : '';
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
    await context.click('#GLUXZipUpdate input');
    await context.waitForSelector('button[name="glowDoneButton"]');
    await context.click('button[name="glowDoneButton"]');
    await context.waitForNavigation({ timeout: 30000, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('#glow-ingress-line2', { timeout: 30000 });
    } catch (error) {
      console.log('zipcode not set');
    }
  }
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
    store: 'amazon_10023',
    zipcode: '10023',
  },
  implementation,
};
