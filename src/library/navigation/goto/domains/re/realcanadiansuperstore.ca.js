module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'realcanadiansuperstore.ca',
        timeout: 100000,
        country: 'CA',
        store: 'Realcanadiansuperstore',
        zipcode: '',
    },
    implementation: async(inputs, parameters, context, dependencies) => {
        const timeout = parameters.timeout ? parameters.timeout : 10000;
        const { url, zipcode, storeId } = inputs;

        console.log(zipcode);
        if (zipcode || storeId) {
            await context.goto("https://www.realcanadiansuperstore.ca/store-locator?type=store&searchQuery=" + encodeURIComponent(inputs.zipcode), { timeout: 100000 });
            await context.waitForSelector('button.location-set-store__button');
            const qry = await context.evaluate((storeID) => { return ('button[data-track-pickup-store="' + storeID.toString().padStart(4, "0") + '"]') }, inputs.storeID);
            await context.clickAndWaitForNavigation(qry);
        }
        await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    },
};