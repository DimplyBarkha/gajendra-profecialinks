module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'SE',
        store: 'alloffice',
        transform: null,
        domain: 'alloffice.se',
        zipcode: '',
    },
    implementation: async function(
        inputs,
        parameters,
        context,
        dependencies,
    ) {
        await context.evaluate(() => {
            const rpc = document.querySelector('meta[property="product:retailer_item_id"]').getAttribute('content');
            let imgs = document.querySelectorAll('img')
            const div = document.createElement('div');
            div.setAttribute('id', 'altImages')
            for (let i = 0; i < imgs.length; i++) {
                if ((imgs[i].getAttribute('alt') + " ").includes(rpc)) {
                    imgs[i].setAttribute('src', 'https://www.alloffice.se/' + imgs[i].getAttribute('src'))
                    div.appendChild(imgs[i])
                }
            }
            document.querySelector('div[id="container"]').append(div);
        });
        const { transform } = parameters;
        const { productDetails } = dependencies;
        return await context.extract(productDetails, { transform });
    }
};