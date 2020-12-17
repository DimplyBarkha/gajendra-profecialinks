module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'selfridges.com',
        timeout: 60000,
        country: 'UK',
        store: 'selfridges',
        zipcode: '',
    },

    implementation: async({ url },
        parameters, context, dependencies,
    ) => {
        const timeout = parameters.timeout ? parameters.timeout : 10000;
        const maxRetries = 3;
        let numberOfCaptchas = 0;

        await context.setBlockAds(false);
        await context.setLoadAllResources(true);
        await context.setLoadImages(true);
        await context.setJavaScriptEnabled(true);
        await context.setAntiFingerprint(false);
        await context.setUseRelayProxy(false);

        await context.goto(url, {
            firstRequestTimeout: 60000,
            timeout: timeout,
            waitUntil: 'load',
            checkBlocked: true,
        });


    },
};