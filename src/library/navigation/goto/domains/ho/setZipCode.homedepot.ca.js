async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      await context.click('localization-confirmation button[tabindex="0"]');
    } catch (e) {
      console.log(e);
    }
    await context.click('acl-icon[symbol="pin"]');
    await context.waitForSelector('input[placeholder*="Postal Code"]');
    await context.setInputValue('input[placeholder*="Postal Code"]', zipcode);
    await context.click('button[aria-describedby="store-selector-search"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.click('div[class*="__column-cta"] button[acl-button]');
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (e) {
    console.log('Error: ', e);
  }
  await context.waitForNavigation();
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'CA',
    domain: 'homedepot.ca',
    store: 'homedepot',
    zipcode: '',
  },
  implementation,
};
