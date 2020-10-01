const { transform } = require('../../../../shared');
async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    await context.evaluate(() => {
        var currentUrl = window.location.href;
        var newElement = document.createElement("DIV");
        newElement.setAttribute('class', 'page-link');
        newElement.innerHTML = currentUrl;
        document.body.appendChild(newElement);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
}

module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'DE',
        store: 'docmorris',
        transform,
        domain: 'docmorris.de',
        zipcode: '',
    },
    implementation,
};