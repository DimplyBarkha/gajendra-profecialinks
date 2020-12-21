module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'flaconi.de',
        timeout: 70000,
        country: 'DE',
        store: 'flaconi',
    },
    implementation: async(inputs, parameters, context, dependencies) => {
        const timeout = parameters.timeout ? parameters.timeout : 10000;
        const { url, zipcode, storeId } = inputs;
        await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
        try {
            const cssBanner = "button#uc-btn-accept-banner";
            const isSelectorAvailable = async(cssSelector) => {
                console.log(`Is selector available: ${cssSelector}`);
                return await context.evaluate(function(selector) {
                    return !!document.querySelector(selector);
                }, cssSelector);
            };

            console.log('.....waiting......');
            await context.waitForSelector(cssBanner, { timeout: 5000 });

            const bannerAvailable = await isSelectorAvailable(cssBanner);
            if (bannerAvailable) {
                await context.click(cssBanner);

            }
        } catch (error) { console.log("No overlay") }
        console.log(zipcode);
        if (zipcode || storeId) {
            await dependencies.setZipCode(inputs);
        }
    },

};