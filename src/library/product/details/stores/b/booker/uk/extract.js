
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'uk',
    store: 'booker',
    transform: null,
    domain: 'booker.co.uk',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    // console.log('producturl', url);
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.click('input[name="OutsideHomePageControl$cmdPostCode"]');
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.setInputValue('input[name="BLC$txtPostcode"]', 'SY23 3JQ');
    await context.click('input[name="BLC$cmdLookupPostcode"]');
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.click('input[id="cmdProceed"]');
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.click('input[name="BranchInfo$cmdBrowseSite"]');
    const inputStr = url.replace(new RegExp('(.*)code=(.*)', 'g'), '$2');
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.waitForSelector('input.headerSearchEntry');
    await context.setInputValue('input.headerSearchEntry', inputStr);
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.click('input[title="Go"]');
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.click('td.info div.info_r1 div a');
    await new Promise(resolve => setTimeout(resolve, 50000));
    await context.waitForSelector('div.piTopInfo img');
    await context.extract(productDetails);
  },
};
