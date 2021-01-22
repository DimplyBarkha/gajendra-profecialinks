
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'booker.co.uk',
    store: 'booker',
    country: 'UK',
  },
  // For navigating from home page to search page because search page is redirecting to home page.
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"proxy":{"use_relay_proxy":false},"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`;
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('input[name="OutsideHomePageControl$cmdPostCode"]');
    await context.click('input[name="OutsideHomePageControl$cmdPostCode"]');
    await context.waitForSelector('input[name="BLC$txtPostcode"]');
    await context.setInputValue('input[name="BLC$txtPostcode"]', 'SY23 3JQ');
    await context.click('input[name="BLC$cmdLookupPostcode"]');
    await context.waitForSelector('input[id="cmdProceed"]');
    await context.click('input[id="cmdProceed"]');
    await context.waitForSelector('input[name="BranchInfo$cmdBrowseSite"]');
    await context.click('input[name="BranchInfo$cmdBrowseSite"]');
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },
};
