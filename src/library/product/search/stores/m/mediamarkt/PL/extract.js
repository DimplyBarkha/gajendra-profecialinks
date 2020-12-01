const { transform } = require('./transform');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'PL',
        store: 'mediamarkt',
        transform,
        domain: 'mediamarkt.pl',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        const { productDetails } = dependencies;
        const { transform } = parameters;
        await context.evaluate(() => {
            const searchUrl = window.location.href;
            const appendElements = document.querySelectorAll("a[class='b-ofr_headDataTitle']");
            if (appendElements.length) {
                appendElements.forEach((element) => {
                    element.setAttribute('searchurl', searchUrl);
                });
            }
        });

        const applyScroll = async function(context) {
            await context.evaluate(async function() {
                let scrollTop = 0;
                while (scrollTop !== 20000) {
                    await stall(2000);
                    scrollTop += 1000;
                    window.scroll(0, scrollTop);
                    if (scrollTop === 20000) {
                        await stall(4000);
                        break;
                    }
                }

                function stall(ms) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, ms);
                    });
                }
            });
        };
        await applyScroll(context);
        return await context.extract(productDetails, { transform });
    },

};