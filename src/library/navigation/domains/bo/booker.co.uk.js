
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'booker.co.uk',
    store: 'booker',
    country: 'UK',
  },
  // For navigating from home page to product page because product page is redirecting to home page.
  implementation: async ({ url }, { country, domain }, context, { dependencies }) => {
    console.log('producturl', url);
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.click('input[name="OutsideHomePageControl$cmdPostCode"]');
    await context.waitForSelector('input[name="BLC$txtPostcode"]');
    await context.setInputValue('input[name="BLC$txtPostcode"]', 'SY23 3JQ');
    await context.click('input[name="BLC$cmdLookupPostcode"]');
    await context.waitForSelector('input[id="cmdProceed"]');
    await context.click('input[id="cmdProceed"]');
    await context.waitForSelector('input[name="BranchInfo$cmdBrowseSite"]');
    await context.click('input[name="BranchInfo$cmdBrowseSite"]');
    const inputStr = url.replace(new RegExp('(.*)code=(.*)', 'g'), '$2');
    await context.waitForSelector('input.headerSearchEntry');
    await context.setInputValue('input.headerSearchEntry', inputStr);
    await context.waitForSelector('input[title="Go"]');
    await context.click('input[title="Go"]');
    await context.waitForSelector('td.info div.info_r1 div a');
    await context.click('td.info div.info_r1 div a');
    await context.waitForSelector('div.piTopInfo img');
  },
};
