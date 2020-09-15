
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.at',
    timeout: null,
    country: 'AT',
    store: 'mediamarkt',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    let url = `${inputs.url}`;
    // await context.setLoadAllResources(true);
    // await context.setBlockAds(false);
    // await context.setFirstRequestTimeout(60);
    // await context.goto(url, { load_timeout: 60 });

    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url);

    // let url = `${inputs.url}`;
    // url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_timeout":350000,"load_all_resources":true}[/!opt!]`;

    // await context.goto(url, { timeout: 350000, waitUntil: 'load'});
    // await context.waitForSelector('input[name="OutsideHomePageControl$cmdPostCode"]');
    // await context.click('input[name="OutsideHomePageControl$cmdPostCode"]');
    // await context.waitForSelector('input[name="BLC$txtPostcode"]');
    // await context.setInputValue('input[name="BLC$txtPostcode"]', 'SY23 3JQ');
    // await context.click('input[name="BLC$cmdLookupPostcode"]');
    // await context.waitForSelector('input[id="cmdProceed"]');
    // await context.click('input[id="cmdProceed"]');
    // await context.waitForSelector('input[name="BranchInfo$cmdBrowseSite"]');
    // await context.click('input[name="BranchInfo$cmdBrowseSite"]');
    // await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
  },

};
