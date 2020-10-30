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
            var searchUrl = window.location.href;
            var appendElements = document.querySelectorAll('div[class="m-offerBox_header"]>h2[class*="headline"]>a') || document.querySelectorAll('p[class="m-productsBox_name"]>a');
            if (appendElements.length) {
                appendElements.forEach((element) => {
                    element.setAttribute('searchurl', searchUrl);
                })
            }
        });
        await context.evaluate(() => {
            const ratingBox = document.querySelectorAll('div[class="m-offerBox_header"]>div[class="m-offerBox_rating"]');
            const ratingArr = []
            ratingBox.forEach((elem) => {
                const ratingValue = elem.querySelectorAll('i[class*="active"]');
                ratingArr.push(ratingValue.length);
            })
            const rows = document.querySelectorAll('div[class="m-offerBox_header"]>h2[class*="headline"]>a') || document.querySelectorAll('p[class="m-productsBox_name"]>a');
            for (let i = 0; i < rows.length; i++) {
                rows[i].setAttribute('ratingvalue', ratingArr[i])
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
    }

};