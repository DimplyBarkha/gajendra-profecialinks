const { transform } = require('../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'UK',
        store: 'tesco',
        transform,
        domain: 'tesco.com',
    },
    implementation: async(inputs,
        parameters,
        context,
        dependencies,
    ) => {
        await context.evaluate(async function() {
            // Get additional product info 2. Currently not retrieving.
            const productInfo2 = Array.from(document.querySelectorAll('[class^="product-info-block product-info-block--"]')).map(elm => {
                if (elm.querySelector('h3')) {
                    const key = elm.querySelector('h3').innerText;
                    const value = elm.querySelector('ul,p').textContent.trim();
                    return `${key}: ${value}`;
                }
            }).filter(elm => elm);
            document.body.setAttribute('additional_product_info2', productInfo2.join('|'));

            // Get additional product info
            const productInfo = Array.from(document.querySelectorAll('#features > ul, #product-description > ul')).map(elm => elm.textContent).filter(elm => elm);
            document.body.setAttribute('additional_product_info', productInfo.join('|'));

            // Get Ingredients
            const ingredientList =
                (document.querySelector('#ingredients > p') &&
                    document.querySelector('#ingredients > p').textContent.trim().replace(/INGREDIENTS:/i, '')
                    .split(/[,\n]/)
                    .filter((elm) => elm)
                    .join('|')) ||
                '';
            document.body.setAttribute('ingredient_list', ingredientList);

            const details = document.querySelector(`script[type="application/ld+json"]`);
            if (details) {
                if (JSON.parse(details.text)[2]) {
                    let imageArr = JSON.parse(details.text)[2].image;
                    let images = imageArr.slice(1).join('|');
                    document.body.setAttribute('additional_image', images);
                }
            }
        });

        await context.evaluate(() => {
            let text = '';
            let x = document.evaluate(
                '//div[@id="product-description"]/* | //div[@id="product-marketing"]/* | //div[@id="manufacturer-marketing"]/* | //div[@id="features"]/* | //div[@id="pack-size"]/*',
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null,
            );
            for (let i = 0; i < x.snapshotLength; i++) {
                let t = ''
                let z = '';
                let item = x.snapshotItem(i)
                if (item.querySelector('h2') || item.nodeName === 'H2') {
                    continue;
                } else if (item.nodeName === 'UL') {
                    const lis = [...item.querySelectorAll('li')];
                    lis.forEach(li => {
                        t = t + (t ? ' || ' : '') + li.innerText;
                    });
                    z = ' || ' + t;
                } else {
                    z = item.innerText;
                }
                text = text + (text ? ' ' : '') + z;
            }
            document.body.setAttribute('additional-desc', text);
        })

        //await context.waitForSelector('div.product-image__container');
        await new Promise(resolve => setTimeout(resolve, 8000));
        const { transform } = parameters;
        const { productDetails } = dependencies;
        await context.extract(productDetails, { transform });
    },
};