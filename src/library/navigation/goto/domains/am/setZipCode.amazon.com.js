
<<<<<<< HEAD
async function implementation(
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

=======
>>>>>>> 7f899d205f620b635ef5b5c41f0f5f0738de61d8
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'amazon.com',
<<<<<<< HEAD
    store: 'amazonPrimePantry',
    zipcode: '10001',
  },
  implementation,
};
=======
    store: 'amazonApparel',
    zipcode: '',
  },
};
>>>>>>> 7f899d205f620b635ef5b5c41f0f5f0738de61d8
