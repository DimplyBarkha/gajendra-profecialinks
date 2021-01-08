module.exports = {
    implements: 'navigation/goto',
    parameterValues: {
        domain: 'unieuro.it',
        timeout: 50000,
        country: 'IT',
        store: 'unieuro',
        zipcode: '',
    },
    implementation: async(inputs, parameterValues, context, dependencies) => {
        let url = `${inputs.url}`;
        await context.setBlockAds(false);
        await context.setJavaScriptEnabled(true);
        url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
        await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, js_enabled: true });
        await context.evaluate(async function() {
            try {
                if (document.querySelector('section[class*="hits"] section:first-child')) {
                    document.querySelector('section[class*="hits"] section:first-child div[class*="title product-tile__title"] >a').click();
                }
            } catch (err) {
                console.log(err);
            }
        });
        try {
            await context.waitForSelector('button[id="onetrust-accept-btn-handler"]', { timeout: 5000 });
            await context.click('button[id="onetrust-accept-btn-handler"]');
        } catch (e) {
            console.log("accept cookie button not presen...t\nError: " + e);
        }

    },
};