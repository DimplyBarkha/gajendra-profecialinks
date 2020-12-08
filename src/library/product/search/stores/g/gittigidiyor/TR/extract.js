async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
        const sellerInformation = document.querySelectorAll('span[class *="seller-nickname"]')
        const sellerNames = [];
        sellerInformation.forEach((element) => { sellerNames.push(element.innerText) });
        const appendElement = document.querySelectorAll('h3[class*="product-title"]');
        appendElement.forEach((element, index) => { element.setAttribute('sellerinformation', sellerNames[index]) })
    })
    return await context.extract(productDetails, { transform });
}
const { transform } = require('./shared')
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'TR',
        store: 'gittigidiyor',
        transform,
        domain: 'gittigidiyor.com',
        zipcode: '',
    },
    implementation,
};