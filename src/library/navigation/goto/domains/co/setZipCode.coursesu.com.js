async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode, url } = inputs;
  try {
    await context.goto('https://www.coursesu.com/magasins/recherche');
    await context.waitForNavigation();
    await context.evaluate(async function (zipcode) {
      document.querySelector('input#store-search').value = zipcode;
      document.querySelector('button.button.accent-button').removeAttribute('disabled');
      document.querySelector('button.button.accent-button').click();
    }, zipcode);
    await context.waitForNavigation();
    await context.waitForSelector('ul.storelocator-stores-list li a.accent-button.choose');
    await context.evaluate(async function () {
      document.querySelector('ul.storelocator-stores-list li a.accent-button.choose') && document.querySelector('ul.storelocator-stores-list li a.accent-button.choose').click();
    });
    try {
      await context.evaluate(async function () {
        document.querySelector('div.custom-dialog__content.custom-dialog__content--login.hidden a.ui-button.ui-button--background.custom-dialog__close') && document.querySelector('div.custom-dialog__content.custom-dialog__content--login.hidden a.ui-button.ui-button--background.custom-dialog__close').click();
      });
    } catch (error) {
      console.log('Login popup not found');
    }
    await context.goto(url);
  } catch (e) {
    console.log(e);
  }
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
