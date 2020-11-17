const implementation = async function(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(() => {
        var searchUrl = window.location.href;
        var appendElements = document.querySelectorAll(' div[class="product-wrapper"]');
        if (appendElements.length) {
            appendElements.forEach((element) => {
                element.setAttribute('searchurl', searchUrl);
            })
        }
    });
    return await context.extract(productDetails, { transform });
}
module.exports = { implementation };