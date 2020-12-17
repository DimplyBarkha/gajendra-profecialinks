const { transform } = require('./format');

async function implementation(inputs, parameters, context, dependencies) {
    const { transform } = parameters;
    const { productDetails } = dependencies;


    // if we're on search site we should click and select first item
    var detailsPage = await context.evaluate(async() => {

        if (document.querySelector('a.c-prod-card__images') != null) {
            var productLink = document.querySelector('a.c-prod-card__images').getAttribute('href');
        }

        return productLink;
    });

    // check if detailsPage exists
    if (detailsPage) {
        await context.goto('https://www.selfridges.com/' + detailsPage);
    }

    await new Promise((resolve) => setTimeout(resolve, 8000));

    await context.evaluate(async() => {
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        //await context.waitForSelector('img.c-image-gallery__img')
        let sku = window.location.href.split('_')[1].split('/')[0]
        document.head.setAttribute('sku', sku)

        function addElementToDocument(id, value, key) {
            const catElement = document.createElement('div');
            catElement.id = id;
            catElement.innerText = value;
            catElement.setAttribute('content', key);
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
        };
        //getting nameExtended
        const name = document.querySelector('span.a-txt-product-description') ? document.querySelector('span.a-txt-product-description').innerText : null;
        const brand = document.querySelector('span.a-txt-brand-name>a') ? document.querySelector('span.a-txt-brand-name>a').innerText : null;
        if (name !== null && brand !== null) {
            //@ts-ignore
            addElementToDocument('nameextended', `${brand} - ${name}`);
        }


        const script = document.querySelector('script[data-component="pdp-semantic-data"]') ? document.querySelector('script[data-component="pdp-semantic-data"]').innerText : null;
        if (document.querySelector('section[data-js-component="productHero"]') !== null) {
            const scriptToString = JSON.parse(script);
            // @ts-ignore

            if (script !== null) {
                //getting variantId
                const sku = scriptToString.model[0].sku;
                // @ts-ignore
                addElementToDocument('variantid', sku);

                //getting availability
                const isAvailable = scriptToString.model[0].offers[0].availability;
                // @ts-ignore
                addElementToDocument('availability', isAvailable)
            }
        }

        const isImgZoom = document.querySelector('span.hero-zoom') ?
            document.querySelector('span.hero-zoom') : null;
        // @ts-ignore
        if (isImgZoom !== null) {
            addElementToDocument('isImgZoom', 'Yes', 'Yes');
        } else {
            addElementToDocument('isImgZoom', 'No', 'No');
        }

        const description1 = document.querySelector('#content1 div.c-tabs__copy') ?
            document.querySelector('#content1 div.c-tabs__copy').innerText : '';
        const description2 = document.querySelectorAll('#content1 div.c-tabs__copy ul li') ?
            document.querySelectorAll('#content1 div.c-tabs__copy li') : '';
        if (description2) {
            console.log(description2);
            const bulletsArr = [description2];
            const bulletsArrSliced = bulletsArr.slice(1);
            // @ts-ignore
            description2.forEach(e => bulletsArrSliced.push(e.textContent));
            let concatDesc = bulletsArrSliced.join(' || ');
            if (concatDesc)
                concatDesc = '|| ' + concatDesc;
            addElementToDocument('descriptionBull', concatDesc);
            console.log(concatDesc);
        } else if (description1) {
            addElementToDocument('description', description1);
            console.log(description1);
        }

        function getElementsByXPath(xpath, parent) {
            let results = [];
            let query = document.evaluate(xpath, parent || document,
                null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0, length = query.snapshotLength; i < length; ++i) {
                results.push(query.snapshotItem(i).textContent.trim());
            }
            return results;
        }
        let items = getElementsByXPath("//script[contains(.,'productId')]");
        if (items && items[0]) {
            let data = items[0].split('"productId":"')[1].split('"')[0];
            console.log(data)
            document.head.setAttribute('variantid', data);
        }

    });

    return await context.extract(productDetails, { transform });
}
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'UK',
        store: 'selfridges',
        transform: transform,
        domain: 'selfridges.com',
        zipcode: '',
    },
    implementation,
};