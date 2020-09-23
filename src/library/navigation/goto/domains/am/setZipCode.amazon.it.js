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
  try {
    await context.waitForSelector('button[name="glowDoneButton"]');
    await context.click('button[name="glowDoneButton"]');
  } catch (error) {
    console.log('Done button not found');
  }
  await context.waitForNavigation();
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'IT',
    domain: 'amazon.it',
    store: 'amazon',
    zipcode: '20019',
  },
  implementation,
};
