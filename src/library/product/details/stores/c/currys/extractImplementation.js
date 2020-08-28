const implementation = async (
    { id },
    parameters,
    context,
    dependencies,
) => {
    const optionalWaitForSelector = async (selector, timeout = 15000) => {
        try {
            await context.waitForSelector(selector, { timeout });
            console.log(`${selector} loaded.`);
            return true;
        } catch (err) {
            console.log(`${selector} never loaded.`);
            return false;
        }
    };

    await optionalWaitForSelector('.shopList .product');

    const readMore = await optionalWaitForSelector('div[data-open-label="Read more"] ~ .long-text-ctl a');

    if (readMore) {
        await context.click('div[data-open-label="Read more"] ~ .long-text-ctl a');
    }

    await context.evaluate(async function (zip, country) {
        const basicDetails = JSON.parse(document.evaluate(`//script[contains(.,'"@type": "Product"')]`, document).iterateNext().textContent);
        const productDigitalData = JSON.parse(document.querySelector('script[id="app.digitalData"]').textContent).product[0];

        const addElement = (id, content) => {
            const packagingElem = document.createElement('div');

            packagingElem.id = id;
            packagingElem.innerText = content;

            document.body.appendChild(packagingElem);
        };

        const makeApiCall = async (url, options) => {
            try {
                console.log(`Making API call to => ${url}`);
                if (!options) {
                    options = {
                        mode: 'no-cors',
                        credentials: 'same-origin',
                        headers: { 'Content-Type': 'application/json' },
                    };

                    return await (await fetch(url, options)).json();
                }

                return await (await fetch(url, options)).text();
            } catch (err) {
                console.log('Error while making API call.', err);
            }
        };

        const buildDescription = () => {
            const article = document.querySelector('#product-info article');
            const description = document.querySelector('.highlights-tablet .main-desc .section-title ~ ul');
            const subNodes = description.querySelectorAll('li');

            let text = '';
            subNodes.forEach(subNode => {
                text += `||${subNode.textContent}`;
            });

            text += article ? ` ${article.textContent.trim()}` : '';
            return text.trim();
        };

        const getSpecification = () => {
            const tbodys = document.querySelectorAll('div#tab2 tbody');
            let content = '';
            tbodys.forEach(tb => {
                const trs = tb.querySelectorAll('tr');
                trs.forEach(t => {
                    if (content) {
                        content += ' || ';
                    }
                    content += t.querySelector('th').textContent + ' : ' + t.querySelector('td').textContent;
                });
            });

            return content;
        };
        addElement('specification', getSpecification());

        const isSelectorPresent = (sel) => {
            return Boolean(document.querySelector(sel));
        };

        const zipInput = isSelectorPresent('div[data-anonid="locationinput"] input[type="search"]');
        const delivery = isSelectorPresent('#delivery.available');
        const outOfStock = isSelectorPresent('.prd-channels .nostock');
        let availability = 'In Stock';

        if (zipInput) {
            let countryRoute = 'https://www.currys.co.uk/gb/uk';
            let long = '-0.106932';
            let lat = '51.508413';

            if (country === 'IE') {
                countryRoute = 'https://www.currys.ie/ie/en';
                long = '-6.26495';
                lat = '53.33537';
            }

            const uri = `${countryRoute}/mcd_postcode_check/sProductId/${basicDetails.sku}/sPostCode/${zip}/latitude/${lat}/longitude/${long}/ajax.html`;
            const res = await makeApiCall(uri);
            console.log(res);
            if (res.status === 'success' && res.data && res.data.postCodeCheck && res.data.postCodeCheck.state !== 'DELIVERABLE') {
                availability = 'Out Of Stock';
            }
        } else if (outOfStock) {
            availability = 'Out Of Stock';
        } else if (!delivery) {
            availability = 'Out Of Stock';
        }
        addElement('availability', availability);

        const actualRating = basicDetails && basicDetails.aggregateRating && basicDetails.aggregateRating.ratingValue && Number(basicDetails.aggregateRating.ratingValue);
        const updatedRating = actualRating ? (actualRating * 5) / 10 : '';
        addElement('rating', updatedRating);

        const productId = productDigitalData.productID || '';
        addElement('productId', productId);

        const manufacturer = productDigitalData.manufacturer || '';
        addElement('manufacturer', manufacturer);

        const brand = (basicDetails.brand && basicDetails.brand.name) || '';
        addElement('brand', brand);

        const description = buildDescription();
        addElement('description', description);
    }, parameters.zipcode, parameters.country);

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
};

module.exports = { implementation };