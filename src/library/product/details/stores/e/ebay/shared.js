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
    const src = await context.evaluate(async function () {
        const iframe = document.querySelector('iframe#desc_ifr');
        // @ts-ignore
        const src = iframe ? iframe.src : '';
        return src;
    });
    await context.extract(productDetails, { transform });
    if (src) {
        try {
            await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        } catch (error) {
            console.log('xxxxxxxxxxxxxxxxxxxxvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvbb');
            await context.evaluate(async function (src) {
                window.location.assign(src);
            }, src);
        }
        try {
            if (parameters.loadedSelector) {
                await context.waitForFunction(function () {
                  return Boolean(document.querySelector('div#ds_div'));
                }, { timeout: 10000 });
              }
            return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
        } catch (error) {
            try {
                await context.waitForSelector('div#ds_div');
                return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = { implementation };