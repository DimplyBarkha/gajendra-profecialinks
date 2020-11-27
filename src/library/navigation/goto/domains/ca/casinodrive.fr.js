
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'casinodrive.fr',
    timeout: 60000,
    country: 'FR',
    store: 'casinodrive',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    // Navigate to choose store
    await context.goto('https://www.casino.fr/prehome/courses-en-ligne/carte-des-magasins/Bourg-en-Bresse%20(01000)');
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await context.waitForSelector('div[class*="map-box__block-store"]:first-of-type a[class*="block-store__main-link"]', { timeout: 60000 });
    await context.clickAndWaitForNavigation('div[class*="map-box__block-store"]:first-of-type a[class*="block-store__main-link"]');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Navigate to search URL
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
