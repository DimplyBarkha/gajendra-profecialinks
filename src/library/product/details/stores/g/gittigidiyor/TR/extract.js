async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const checkNoResultXpath = async (xpath) => {
        return await context.evaluate((xpath) => {
            return Boolean(document.evaluate(xpath, document) && document.evaluate(xpath, document).iterateNext());
        }, xpath)
    }
    const noResultXpath = `//span[contains(text(),"Bu ürün kapanmıştır")]`;
    const isPresent = await checkNoResultXpath(noResultXpath);
    if (isPresent) {
        return;
    }
    const addOptionalWait = async (selector) => {
        try {
            await context.waitForSelector(selector, { timeout: 60000 })
            console.log(`${selector}-------------loaded successly`);
        } catch (e) {
            console.log(`${selector}--------------did not load at all`)
        }
    }
    const enhancedContentSelector = `div[id='sp-desktopDescription']`;
    const imageSelector = `img[id='big-photo']`
    addOptionalWait(enhancedContentSelector);
    addOptionalWait(imageSelector);
    await context.evaluate(() => {
        const script = document.querySelectorAll('script[type="application/ld+json"]');
        const ourScript1 = script && [...script].find(element => element.innerText.includes('sku'));
        const dataObjext = ourScript1 && ourScript1.innerText && ourScript1.innerText.trim();
        const jsonData = JSON.parse(dataObjext);
        const sku = jsonData && jsonData.mainEntity && jsonData.mainEntity.offers && jsonData.mainEntity.offers.itemOffered && jsonData.mainEntity.offers.itemOffered[0] && jsonData.mainEntity.offers.itemOffered[0].sku;
        const skuElement = document.createElement('div');
        skuElement.className = 'skuinfo';
        skuElement.setAttribute('sku', sku);
        document.body.append(skuElement);
    })
    return await context.extract(productDetails, { transform });
}
const { transform } = require('../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'TR',
        store: 'gittigidiyor',
        transform,
        domain: 'gittigidiyor.com',
        zipcode: '',
    },
    implementation,
};