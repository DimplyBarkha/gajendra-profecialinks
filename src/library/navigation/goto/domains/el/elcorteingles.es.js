module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'elcorteingles.es',
        store: 'elcorteingles',
        country: 'ES',
    },
    implementation: async({ url }, parameters, context, dependencies) => {
        url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":80000,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
        await context.goto(url, {
            first_request_timeout: 60000,
            block_ads: false,
            load_all_resources: true,
            embed_iframes: true,
            images_enabled: true,
            timeout: 100000,
            waitUntil: 'load',
        });
    },
};