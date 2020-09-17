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
  await context.waitForSelector('button[name="glowDoneButton"]');
  await context.click('button[name="glowDoneButton"]');
  await context.waitForNavigation();
  await new Promise(resolve => setTimeout(resolve, 5261));
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'AE',
    domain: 'amazon.ae',
    store: 'amazon',
    zipcode: '',
  },
  implementation,
};
