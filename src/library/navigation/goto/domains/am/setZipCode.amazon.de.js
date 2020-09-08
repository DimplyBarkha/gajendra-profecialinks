<<<<<<< HEAD
=======
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
>>>>>>> 1b968a4d4906f8d372db883e4431c1679570a9c6

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'DE',
    domain: 'amazon.de',
<<<<<<< HEAD
    store: 'amazonMsReviews',
    zipcode: '',
  },
=======
    store: 'amazon',
    zipcode: '10117',
  },
  implementation,
>>>>>>> 1b968a4d4906f8d372db883e4431c1679570a9c6
};
