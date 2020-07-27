async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
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
  // await context.waitForSelector('button[name="glowDoneButton"]');
  // await context.click('button[name="glowDoneButton"]');
  await context.waitForNavigation({ timeout: 70000, waitUntil: 'load' });
  await context.waitForSelector('#main-image-container img , #altImages li[class*="imageThumbnail"] img');
  // await new Promise((r)=>setTimeout(r, 1000));
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    domain: 'amazon.co.uk',
    timeout: null,
    country: 'UK',
    store: 'amazon',
    zipcode: 'SW1P 3EU',
  },
  implementation,
};
