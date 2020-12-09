async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
        await context.waitForSelector('iframe#desc_ifr');
    } catch (err) {
        console.log('manufacturer contents not loaded or unavailable');
    }
    const src = await context.evaluate(async function() {
        const iframe = document.querySelector('iframe#desc_ifr');
        // @ts-ignore
        const src = iframe ? iframe.src : '';
        return src;
    });
    await context.extract(productDetails, { transform });
    if (src) {
        try {
            await context.setBypassCSP(true);
            await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
            await context.waitForSelector('div#ds_div');
            return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
        } catch (error) {
            try {
                await context.setBypassCSP(true);
                await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
                await context.waitForSelector('div#ds_div');
                return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
            } catch (error) {
                console.log('could not load page', error);
            }
        }
    }
}

module.exports = { implementation };