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

    await optionalWaitForSelector('h1[itemprop="name"]');

    const readMore = await optionalWaitForSelector('div[data-open-label="Read more"] ~ .long-text-ctl a');

    if (readMore) {
        await context.click('div[data-open-label="Read more"] ~ .long-text-ctl a');
    }

    await context.evaluate(async function (zip, country) {
        // eslint-disable-next-line
        // const basicDetails = JSON.parse(document.evaluate(`//script[contains(.,'"@type": "Product"')]`, document).iterateNext().textContent);
        // const productDigitalData = JSON.parse(document.querySelector('script[id="app.digitalData"]').textContent).product[0];

        // PreDefined Functions 

        const htmlDecode = (input) => {
            var e = document.createElement('textarea');
            e.innerHTML = input;
            // handle case of empty input
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
        }

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

        const getSel = (sel, prop) => {
            const el = document.querySelector(sel);
            if (prop && el) return el[prop];
            return el || '';
        };

        const getXpath = (xpath, prop) => {
            const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
            let result;
            if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
            else result = elem ? elem.singleNodeValue : '';
            return result && result.trim ? result.trim() : result;
        };

        const getAllXpath = (xpath, prop) => {
            const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const result = [];
            for (let index = 0; index < nodeSet.snapshotLength; index++) {
                const element = nodeSet.snapshotItem(index);
                if (element) result.push(prop ? element[prop] : element.nodeValue);
            }
            return result;
        };

        function setAttributes(el, attrs) {
            for (var key in attrs) {
                el.setAttribute(key, attrs[key]);
            }
        }

        const alternateImagesTransform = (selector) => {
            if (selector) {
                let images = selector.map((e) => { return `https://b3h2.scene7.com/is/image/BedBathandBeyond/${e}?$1200$&wid=1200&hei=1200` }).join(", ");
                return images;
            } else {
                return "";
            }
        };

        const listPriceTransform = (selector) => {
            let price = "";
            if (selector) {
                if (!selector.WAS_PRICE) {
                    return price = "";
                }
                if (selector.WAS_PRICE) {
                    price = selector.IS_PRICE
                    return price;
                }
            } else {
                return "";
            }
        };

        const priceTransform = (selector) => {

            if (selector) {
                let price = selector.IS_PRICE
                return price;
            } else {
                return "";
            }
        };

        const buildDescription = (selector) => {
            const description = selector.DESCRIPTION
            const longDescription = selector.LONG_DESCRIPTION.replace(/((<ul>|<UL>|<li>|<LI>|<\/li>|<\/LI>|<\/UL>|<\/ul>))/g, "");
            let finaldescription = htmlDecode(description + longDescription).trim()
            return finaldescription;
        };


        const bulletDescriptionTransform = (selector) => {

            const longDescription = selector.LONG_DESCRIPTION.split(/<\/li>|<\/LI>/).filter((e) => { if (e.includes('<li>')) { return e.includes('<li>') } else { return e.includes('<LI>') } });
            console.log(longDescription.length, "ceck")
            return longDescription.length;
        };


        let productID = getXpath("//meta[@property='og:url']/@content", 'nodeValue').match("[^/]+$")[0];

        const uri = `https://www.bedbathandbeyond.ca/apis/services/composite/v1.0/product-sku?product=${productID}`;
        const productApiDetails = await makeApiCall(uri);
        const apiDataResponse = productApiDetails.data;

        const nameExtended = (productApiDetails.data.PRODUCT_DETAILS && productApiDetails.data.PRODUCT_DETAILS.DISPLAY_NAME) || '';
        const image = `https://b3h2.scene7.com/is/image/BedBathandBeyond/${productApiDetails.data.PRODUCT_DETAILS.SCENE7_URL}?$1200$&wid=1200&hei=1200`;
        const imageAlt = getXpath("//div[contains(@class,'slick-active')]//img[contains(@class,'ProductMediaCarouselStyle')]/@alt", 'nodeValue');
        const alternateImages = productApiDetails.data.SKU_DETAILS ? alternateImagesTransform(productApiDetails.data.SKU_DETAILS[0].ALT_IMG_SORTED) : ""
        const listPrice = productApiDetails.data.PRODUCT_DETAILS ? listPriceTransform(productApiDetails.data.PRODUCT_DETAILS) : "";
        const price = productApiDetails.data.PRODUCT_DETAILS ? priceTransform(productApiDetails.data.PRODUCT_DETAILS) : "";
        const description = productApiDetails.data.PRODUCT_DETAILS ? buildDescription(productApiDetails.data.PRODUCT_DETAILS) : "";
        const descriptionBullets = productApiDetails.data.PRODUCT_DETAILS ? bulletDescriptionTransform(productApiDetails.data.PRODUCT_DETAILS) : "";
        const brandText = (productApiDetails.data.PRODUCT_DETAILS && productApiDetails.data.PRODUCT_DETAILS.BRAND_NAME) || '';
        const sku = (productApiDetails.data.PRODUCT_DETAILS && productApiDetails.data.PRODUCT_DETAILS.SKU_ID[0]) || '';
        const ratingCount = (productApiDetails.data.PRODUCT_DETAILS && productApiDetails.data.PRODUCT_DETAILS.REVIEWS) || '';
        const aggregateRating = (productApiDetails.data.PRODUCT_DETAILS && productApiDetails.data.PRODUCT_DETAILS.RATINGS) || '';
        const element = document.querySelectorAll('div[id="multiSkuContainer"] ul[role="listbox"] li');




        if (apiDataResponse) {
            // SKU
            if (element) {
                for (var i = 0; i < element.length; i++) {
                    setAttributes(element[i],
                        {
                            sku: apiDataResponse.SKU_DETAILS[i].SKU_ID,
                            color: apiDataResponse.SKU_DETAILS[i].COLOR,
                        });
                }
            }
        }



        addElement('nameExtended', nameExtended);
        addElement('image', image);
        addElement('imageAlt', imageAlt);
        addElement('alternateImages', alternateImages);
        addElement('listPrice', listPrice);
        addElement('price', price);
        addElement('description', description);
        addElement('descriptionBullets', descriptionBullets);
        addElement('brandText', brandText);
        addElement('gtin', productID);
        addElement('sku', sku);
        addElement('ratingCount', ratingCount);
        addElement('aggregateRating', aggregateRating);








    }, parameters.zipcode, parameters.country);

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
};

module.exports = { implementation };
