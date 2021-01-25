// @ts-nocheck
const { transform } = require('./transform');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'NL',
        store: 'plus',
        transform,
        domain: 'plus.nl',
        zipcode: '',
    },
    implementation: async function implementation(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const variables = {
            target: '.main-default-container',
        };
        let productUrl = '';
        try {
            const id = await context.evaluate(() => {
                return window.location.href.split('=')[1];
            });
            await context.click(`div[data-id="${id}"] a`);
            await context.waitForNavigation();
            await context.waitForSelector('.ish-productImagery img');
            productUrl = await context.evaluate(() => {
                return window.location.href;
            });
            variables.url = productUrl;
            await context.evaluate((variables) => {
                document.querySelector(variables.target).setAttribute('product-url', variables.url);
                let promotion = '';
                if (document.querySelector('div.text-clover sup')) {
                    promotion = document.querySelector('div.shape-tekst-block').innerText + ' ' + document.querySelector('div.text-clover').innerText.replace(document.querySelector('div.text-clover sup').innerText, '') + '.' + document.querySelector('div.text-clover sup').innerText;
                } else {
                    promotion = document.querySelector('div.product-tile__price--discount').innerText;
                }
                document.querySelector(variables.target).setAttribute('promotion', promotion);
            }, variables);
        } catch (e) {
            console.log('No such product exists.');
            productUrl = await context.evaluate(() => {
                return window.location.href;
            });
            variables.url = productUrl;
            await context.evaluate((variables) => {
                const body = document.querySelector('body');
                const div = document.createElement('div');
                div.className = 'main-default-container';
                body.append(div);
                body.setAttribute("bullet-count", (document.querySelector("div[class*=description-container]").innerText.split('•').length - 1).toString())
                document.querySelector(variables.target).setAttribute('product-url', variables.url);
            }, variables);
        }
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    },
};