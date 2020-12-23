
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'IT',
    domain: 'primenow.amazon.it',
    store: 'amazonPrimeNow',
    zipcode: '20161',
  },
  implementation: async ({ url, zipcode }, parameterValues, context, dependencies) => {
    const homePage = await context.evaluate(() => document.querySelector('#lsPostalCode'));
    if (homePage) {
      await context.evaluate((zipcode) => { document.querySelector('#lsPostalCode').value = zipcode; }, zipcode);
      await context.click('input.a-button-input');
      await context.waitForNavigation();
      await context.goto(url, { waitUntil: 'load' });
      await context.waitForNavigation();
      // Have to do another goto for redirection.
      await context.goto(url, { waitUntil: 'load' });
    } else {
      const correctLocation = await context.evaluate((zipcode) =>
        document.querySelector('span[class*="page_header_drop_menu_change_location_trigger__bottomContent"]').textContent.includes(zipcode),
      zipcode,
      );

      if (!correctLocation) {
        await context.setInputValue('input#postalCode', zipcode);
        // await context.evaluate((zipcode) => { document.querySelector('#postalCode').value = zipcode; }, zipcode);
        await context.click('button[class*="search_form__submitPostcode"]');
        await context.waitForNavigation();
      }
    }
  },
};
