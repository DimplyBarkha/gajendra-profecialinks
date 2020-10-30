async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { zipcode } = inputs;
    //await context.waitForSelector('#nav-packard-glow-loc-icon');
    //await context.click('#nav-packard-glow-loc-icon');
    //await context.waitForSelector('input#GLUXZipUpdateInput');
    // try {
    //   await context.click('a#GLUXChangePostalCodeLink');
    // } catch (error) {
    //   console.log('Element not visible');
    // }
    // const allCookies = await context.cookies();
    // allCookies.forEach(({ name, domain }) => {
    //   console.log(name, 'and', domain);
    //   context.deleteCookies({
    //     name, domain,
    //   });
    // });
    //await context.setInputValue('input#GLUXZipUpdateInput', zipcode);
    //await context.waitForSelector('#GLUXZipUpdate input');
    //await context.click('#GLUXZipUpdate input');
    // await context.waitForSelector('button[name="glowDoneButton"]');
    // await context.click('button[name="glowDoneButton"]');
    await context.waitForNavigation({ timeout: 70000, waitUntil: 'load', js_enabled: true, css_enabled: false });
    await context.waitForSelector('#main-image-container img , #altImages li[class*="imageThumbnail"] img, div[data-asin][data-component-type=s-search-result]');
    await new Promise((resolve) => setTimeout(resolve, 20000));
}
module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        domain: 'amazon.co.uk',
        timeout: null,
        country: 'UK',
        store: 'amazon',
        zipcode: 'SW1P 3EU',
    },
    implementation,
};