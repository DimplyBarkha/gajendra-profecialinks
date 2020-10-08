async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  try {
    await context.waitForSelector('a#tablet-store-drop-down');
    await context.click('a#tablet-store-drop-down');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.waitForSelector('div[id="tablet-store-pop-over"][style="display: block;"]');
    await context.setInputValue('input[id="postal-code"]', zipcode);
    await context.waitForSelector('button[class=btn][data-postal-code-submit]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.click('button[class=btn][data-postal-code-submit]');
    await new Promise(resolve => setTimeout(resolve, 10000));
  } catch (e) {
    console.log('Error: ', e)
  }
  await context.waitForNavigation();
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'CA',
    domain: 'leons.ca',
    store: 'leons',
    zipcode: '',
  },
  implementation,
};
