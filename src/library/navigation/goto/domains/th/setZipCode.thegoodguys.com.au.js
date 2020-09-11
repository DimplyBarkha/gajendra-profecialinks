async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { url, zipcode } = inputs;
    const { country, domain, store } = parameters;

    // TODO: add your impl - must be self contained (no require/import/external functions)
    await context.click('div#delivery_store_stock_opt', { timeout: 20000 });
    await context.waitForSelector('button[data-target="#storechange"]');
    await context.click('button[data-target="#storechange"]', { timeout: 20000 });
    await context.waitForSelector('input[id="preferredStorePostcode"]');
    await context.setInputValue('input[id="preferredStorePostcode"]', zipcode);
    await context.waitForSelector('div#preferredStoreDiv > div');
    await context.click('div#preferredStoreDiv > div', { timeout: 20000 });
    await context.waitForSelector('div[id="prefStModalsetStrBttn_0"]');
    await context.click('div[id="prefStModalsetStrBttn_0"]', { timeout: 20000 });
    await context.waitForSelector('p.skt_text');
}
module.exports = {
    implements: 'navigation/goto/setZipCode',
    parameterValues: {
        country: 'AU',
        domain: 'thegoodguys.com.au',
        store: 'thegoodguys',
        zipcode: '',
    },
    implementation,
};