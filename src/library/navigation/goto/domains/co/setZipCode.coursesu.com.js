async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  await context.waitForSelector('a.change-store');
  await context.click('a.change-store');
  try {
    await context.waitForSelector('input.geolocation-input');
    await context.setInputValue('input.geolocation-input', zipcode);

    await context.waitForSelector('div.search-suggestions p');
    await context.click('div.search-suggestions p');

    await context.waitForSelector('ul.storelocator-stores-list li a.accent-button.choose');
    await context.click('ul.storelocator-stores-list li a.accent-button.choose');
    try {
      await context.click('div.custom-dialog__content.custom-dialog__content--login.hidden a.ui-button.ui-button--background.custom-dialog__close');
    } catch (error) {
      console.log('Login popup not found');
    }
  } catch (e) {
    console.log(e);
  }
  await context.waitForNavigation();
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'FR',
    domain: 'coursesu.com',
    store: 'coursesu',
    zipcode: '76120',
  },
  implementation,
};
