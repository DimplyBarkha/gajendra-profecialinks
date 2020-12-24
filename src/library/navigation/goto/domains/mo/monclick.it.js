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

        url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
        await context.goto(url, { timeout: parameterValues.timeout });
    },
};