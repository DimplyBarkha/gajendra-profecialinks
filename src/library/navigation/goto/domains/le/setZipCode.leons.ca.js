async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  try {
    await context.waitForSelector('button[id="availability-postal-code"]');
    await context.click('button[id="availability-postal-code"]');
    await new Promise(resolve => setTimeout(resolve, 5000))
    await context.waitForSelector('input[id="postal-code-popup"]');
    await context.setInputValue('input[id="postal-code-popup"]', zipcode);
    await context.waitForSelector('button[id="postal-code-confirm"]');
    await context.click('button[id="postal-code-confirm"]');
    await new Promise(resolve => setTimeout(resolve, 5000))
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
