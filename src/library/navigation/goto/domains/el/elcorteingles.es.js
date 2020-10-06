module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'elcorteingles.es',
        store: 'elcorteingles',
        country: 'ES',
    },
    implementation: async({ url }, parameters, context, dependencies) => {
        url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":100000,"load_timeout":80,"load_all_resources":true}[/!opt!]`;
        await context.goto(url, {
            first_request_timeout: 60000,
            block_ads: false,
            load_all_resources: true,
            images_enabled: true,
            timeout: 200000,
            waitUntil: 'load',
        });
    },
};