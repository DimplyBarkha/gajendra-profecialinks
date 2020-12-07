async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    console.log('params', parameters);

    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));

    await dependencies.goto({ url, zipcode: inputs.zipcode });
    if (parameters.loadedSelector) {
        await context.waitForFunction(function (sel, xp) {
            return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }

    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(async (xp) => {
        return document.evaluate(xp, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
    }, parameters.noResultsXPath);
}
// Implementation where noResultsXpath returns a boolean

module.exports = {
    implementation,
}