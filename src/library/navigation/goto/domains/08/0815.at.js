module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: '0815.at',
        timeout: 50000,
        country: 'AT',
        store: '0815',
        zipcode: '',
    },
    implementation: async({ url }, parameters, context, dependencies) => {
        url = `${url}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
        await context.goto(url, {
            block_ads: false,
            load_all_resources: true,
            images_enabled: true,
            timeout: 100000,
            waitUntil: 'networkidle0',
        });
    },
};