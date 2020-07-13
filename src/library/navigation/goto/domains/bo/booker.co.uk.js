
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'booker.co.uk',
    store: 'booker',
    country: 'UK',
  },
  // For navigating from home page to search page because search page is redirecting to home page.
  implementation: async ({ url }, parameterValues, context, dependencies) => {
    await context.goto('https://www.booker.co.uk/home.aspx', { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(() => {
      if (document.querySelector('input[name="OutsideHomePageControl$cmdPostCode"]')) {
        document.querySelector('input[name="OutsideHomePageControl$cmdPostCode"]').click();
      }
    });

    try {
      await context.waitForSelector('input[name="BLC$txtPostcode"]', { timeout: 30000 });
    } catch (err) {
      console.log('Selector did not load.');
    }

    await context.evaluate(() => {
      if (document.querySelector('input[name="BLC$txtPostcode"]')) {
        document.querySelector('input[name="BLC$txtPostcode"]').value = 'SY23 3JQ';
        document.querySelector('#BLC_cmdLookupPostcode').click();
      }
    });

    try {
      await context.waitForSelector('input[id="cmdProceed"]', { timeout: 30000 });
    } catch (err) {
      console.log('Selector did not load.');
    }
    await context.evaluate(() => {
      if (document.querySelector('input[src="/images/buttons/lookup.gif"]')) {
        document.querySelector('input[src="/images/buttons/lookup.gif"]').click();
      }
    });

    try {
      await context.waitForSelector('input[name="BranchInfo$cmdBrowseSite"]', { timeout: 30000 });
    } catch (err) {
      console.log('Selector did not load.');
    }
    await context.evaluate(() => {
      document.querySelector('#BranchInfo_cmdBrowseSite').click();
    });

    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  },
};
