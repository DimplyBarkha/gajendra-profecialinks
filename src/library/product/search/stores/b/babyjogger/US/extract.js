const { transform } = require('./transform');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'US',
        store: 'babyjogger',
        transform,
        domain: 'babyjogger.com',
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
            var appendElements = document.querySelectorAll("div[class='product-tile']");
            if (appendElements.length) {
                appendElements.forEach((element) => {
                    element.setAttribute('searchurl', searchUrl);
                })
            }
        });
        await context.evaluate(() => {
            const priceContainer2 = document.querySelectorAll('div[class="price text20-20-14"]')
            let price = [];
            if (priceContainer2.length) {
                [...priceContainer2].forEach((elem) => {
                    const pricelist1 = elem.querySelectorAll('span[class*="price-tag"] span[class*="outline "]');
                    if ([...pricelist1].length === 2) {
                        price.push(pricelist1[1].innerText);
                    } else {
                        price.push(pricelist1[0].innerText);
                    }
                })
            }
            const rows = document.querySelectorAll('div[class="product-tile"]');
            if (rows.length) {
                for (let i = 0; i < rows.length; i++) {
                    rows[i].setAttribute('price1', price[i])
                }
            }
        })
        return await context.extract(productDetails, { transform });
    },
};