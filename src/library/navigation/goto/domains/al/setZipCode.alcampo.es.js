
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'ES',
    domain: 'alcampo.es',
    store: 'alcampo',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const storeId = inputs.Postcode;
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    
    await context.waitForSelector('#header-container .titleNameBlock .nameMyStore');
    const popup = await context.evaluate(() =>
      document.querySelector('.cc_b_ok.auxOKButton.cookie-button'),
    );
    if (popup) {
      await context.click('.cc_b_ok.auxOKButton.cookie-button');
    }
    await context.click('#subNavContainer')
    await context.click('#header-container .titleNameBlock .nameMyStore');
    await context.waitForSelector('#header-container .botonera.botonera-noLogged:nth-of-type(2) .secondary-button.black-secondary');
    await context.click('#header-container .botonera.botonera-noLogged:nth-of-type(2) .secondary-button.black-secondary');
    await context.waitForSelector(
      '#postalCode',
    );
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate((storeId) => {
      const input = document.querySelector('#postalCode')
      input.setAttribute('value', storeId)

    }, storeId)
    await context.waitForSelector('#changePostalCodeButton');
    await context.click('#changePostalCodeButton');
  },
};
