
module.exports = {
  parameterValues: {
    country: 'US',
    domain: 'primenow.amazon.com',
    store: 'amazonPrimeNow',
  },
  // For navigating from home page to search page because we have to enter the zip code in  home page.
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
        await context.evaluate((zipcode) => { document.querySelector('#postalCode').value = zipcode; }, zipcode);
        await context.click('button[class*="search_form__submitPostcode"]');
        await context.waitForNavigation();
      }
    }
  },
};
