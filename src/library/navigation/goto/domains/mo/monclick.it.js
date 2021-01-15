module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'monclick.it',
        timeout: null,
        country: 'IT',
        store: 'monclick',
        zipcode: '',
    },
    implementation: async(inputs, parameterValues, context, dependencies) => {
        let url = `${inputs.url}`;
        await context.setBlockAds(false);
        await context.setLoadAllResources(true);
        await context.setLoadImages(true);
        await context.setJavaScriptEnabled(true);
        await context.setAntiFingerprint(false);
        await context.setUseRelayProxy(false);

        // url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
        await context.goto(url, { timeout: parameterValues.timeout });
        await new Promise(resolve => setTimeout(resolve, 15000));
    },
};