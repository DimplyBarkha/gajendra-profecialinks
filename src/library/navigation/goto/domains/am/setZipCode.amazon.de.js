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
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  try {
    await context.click('a#GLUXChangePostalCodeLink');
  } catch (error) {
    console.log('Element not visible');
  }
  await context.setInputValue('input#GLUXZipUpdateInput', zipcode);
  await context.waitForSelector('#GLUXZipUpdate input');
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.click('#GLUXZipUpdate input');
  await context.waitForSelector('button[name="glowDoneButton"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.click('button[name="glowDoneButton"]');
  await context.waitForNavigation();
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'DE',
    domain: 'amazon.de',
    store: 'amazon',
    zipcode: '10117',
  },
  implementation,
};
