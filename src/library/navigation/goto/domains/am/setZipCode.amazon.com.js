<<<<<<< HEAD
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
}
=======
>>>>>>> d95f97099fa753c762a2d504fde447c181e6fd2e

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
<<<<<<< HEAD
    store: 'Amazonprimepantry_45202',
    zipcode: '45202',
  },
  implementation,
=======
    store: 'amazonApparel',
    zipcode: '',
  },
>>>>>>> d95f97099fa753c762a2d504fde447c181e6fd2e
};
