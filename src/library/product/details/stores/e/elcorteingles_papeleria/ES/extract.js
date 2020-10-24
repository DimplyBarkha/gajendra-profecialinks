const { transform } = require('../../elcorteingles/ES/transform');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'ES',
        store: 'elcorteingles_papeleria',
        transform: transform,
        domain: 'elcorteingles.es',
        zipcode: '',
    },
    implementation: async({ inputString }, { country, domain, transform }, context, { productDetails }) => {
        const sectionsDiv = 'h1[id="js-product-detail-title"]';
        await context.waitForSelector(sectionsDiv, { timeout: 90000 });
        await context.evaluate(async function() {

            let productPage = document.querySelector('h1[id="js-product-detail-title"]');
            if (!productPage) {
                console.log('ERROR: Not a Product Page');
            }

            // function to append the elements to DOM
            function addElementToDocument(key, value) {
                const catElement = document.createElement('div');
                catElement.id = key;
                catElement.textContent = value;
                catElement.style.display = 'none';
                document.body.appendChild(catElement);
            }

            let brand = document.querySelector('.product_detail-brand').textContent;
            document.querySelector("#js-product-detail-title").innerHTML = brand + " " + document.querySelector('#js-product-detail-title').textContent;

            // function to get the json data from the string
            function findJsonData(scriptSelector, startString, endString) {
                try {
                    const xpath = `//script[contains(.,'${scriptSelector}')]`;
                    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    const scriptContent = element.textContent;
                    const startIdx = scriptContent.indexOf(startString);
                    let endIdx = scriptContent.indexOf(endString);
                    let jsonStr = '';
                    if (Number(endIdx) < 800) {
                        endString = ';window';
                        endIdx = scriptContent.indexOf(endString);
                        jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
                    } else {
                        jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
                    }
                    jsonStr = jsonStr.trim();
                    return JSON.parse(jsonStr);
                } catch (error) {
                    console.log(error.message);
                }
            }

            // function to get the json data from the textContent
            function findJsonObj(scriptSelector, video) {
                if (video) {
                    var result = document.evaluate(video, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    return result;
                } else {
                    try {
                        const xpath = `//script[contains(.,'${scriptSelector}')]`;
                        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        let jsonStr = element.textContent;
                        jsonStr = jsonStr.trim();
                        return JSON.parse(jsonStr);
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            }

            const makeApiCall = async(url, options) => {
                try {
                    console.log(`Making API call to => ${url}`);
                    if (!options) {
                        options = {
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'application/json' },
                        };

                        return await (await fetch(url, options)).json();
                    }

                    return await (await fetch(url, options)).text();
                } catch (err) {
                    console.log('Error while making API call.', err);
                }
            };

            const productAvailablity = '//div[contains(@class,"product_detail-purchase")]//div[contains(@class,"product_detail-add_to_cart")]//span[@class="dataholder"]/@data-json';
            const passKey = 'caBFucP0zZYZzTkaZEBiCUIK6sp46Iw7JWooFww0puAxQ';
            const availablity = findJsonObj('', productAvailablity);

            const productID = JSON.parse(availablity.snapshotItem(0).value).code_a ? JSON.parse(availablity.snapshotItem(0).value).code_a.trim('') : '';
            const sku = JSON.parse(availablity.snapshotItem(0).value).variant ? JSON.parse(availablity.snapshotItem(0).value).variant.trim('') : '';
            const storeId = JSON.parse(availablity.snapshotItem(0).value).store_id ? JSON.parse(availablity.snapshotItem(0).value).store_id.trim('') : '';

            if (productID) {
                // API
                const productsData = `https://www.elcorteingles.es/api/product/${productID}?product_id=${productID}&skus=${sku}&store_id=${storeId}&original_store=0`;
                const apiDataResponse = await makeApiCall(productsData, {});

                if (apiDataResponse) {
                    // if (JSON.parse(apiDataResponse)._product_model) {
                    //   document.querySelector('.sku-model').textContent = `MODELO: ${JSON.parse(apiDataResponse)._product_model}`;
                    // }
                    addElementToDocument('mpc', JSON.parse(apiDataResponse)._product_model);
                    addElementToDocument('sku', JSON.parse(apiDataResponse)._datalayer[0].product.variant);
                    addElementToDocument('gtin', JSON.parse(apiDataResponse)._datalayer[0].product.gtin);
                    addElementToDocument('retailer_product_code', JSON.parse(apiDataResponse).id);
                    addElementToDocument('variantInformation', JSON.parse(apiDataResponse)._delivery_options[0].skus[0].variant ? JSON.parse(apiDataResponse)._delivery_options[0].skus[0].variant[0].value : "");
                    if(JSON.parse(apiDataResponse).video && JSON.parse(apiDataResponse).video.length > 0) {
                        console.log('we have the video array in the api response');
                        if(JSON.parse(apiDataResponse).video[0].url) {
                            console.log('we have url in the video array');
                            addElementToDocument('thumbnailVideo', JSON.parse(apiDataResponse).video[0].url);
                        } else {
                            console.log('there is no url in the video array');
                        }
                    } else {
                        console.log('There is no video in the api response');
                    }
                }
            }

            if (productID) {
                // Number of reviews and rating
                const reviewData = `https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=${passKey}&productid=${productID}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=es_ES`;
                const apiReviewResponse = await makeApiCall(reviewData, {});
                const responseRatingCount = JSON.parse(apiReviewResponse) ? JSON.parse(apiReviewResponse).reviewSummary.numReviews : ratingFromDOM();
                const responseReviewRating = JSON.parse(apiReviewResponse) ? parseFloat(JSON.parse(apiReviewResponse).reviewSummary.primaryRating.average).toFixed(1).replace('.', ',') :
                    '';
                addElementToDocument('ratingCount', responseRatingCount);
                addElementToDocument('aggregateRating', responseReviewRating);
            }

            const imageData = findJsonObj('image');
            // Check for the data and append to DOM
            if (imageData) {
                const checkImage = imageData.image.slice(-1)[0];
                addElementToDocument('product_image', typeof(checkImage) === 'string' && checkImage.includes('https://') ? checkImage : `https:${imageData.image.slice(-1)[0]}`);
                addElementToDocument('product_description', imageData.description);
            }

            // elements from data Layer object
            const dataObj = findJsonData('dataLayer', '=', ';');
            // Check for the data and append to DOM
            if (dataObj) {
                if (dataObj[0].product) {
                    if (dataObj[0].product.status.toLowerCase() === 'available' || dataObj[0].product.status.toLowerCase() === 'add') {
                        addElementToDocument('availability', 'In Stock');
                    } else {
                        addElementToDocument('availability', 'Out Of Stock');
                    }
                    // Check for the brand  and append to DOM
                    if (dataObj[0].product.brand) {
                        addElementToDocument('brand', dataObj[0].product.brand);
                    }

                    // Check for the brand  and append to DOM
                    if (dataObj[0].product.gtin) {
                        addElementToDocument('gtin', dataObj[0].product.gtin);
                    }

                    // Check for the brand  and append to DOM
                    // if (dataObj[0].product.brand) {
                    //   addElementToDocument('retailer_product_code', dataObj[0].product.code_a);
                    // }

                    // Check for the sku  and append to DOM
                    if (dataObj[0].product.code_a) {
                        addElementToDocument('sku', dataObj[0].product.id);
                    }

                    // Check for List Price
                    if (Number(dataObj[0].product.price.o_price) === Number(dataObj[0].product.price.f_price)) {
                        addElementToDocument('listPrice', '');
                    } else {
                        if (dataObj[0].product.price.o_price) {
                            addElementToDocument('listPrice', dataObj[0].product.price.o_price.toString().replace('.', ','));
                        } else {
                            if (dataObj[0].product.price.original) {
                                addElementToDocument('listPrice', dataObj[0].product.price.original.toString().replace('.', ','));
                            } else {
                                addElementToDocument('listPrice', '');
                            }
                        }
                    }

                    // Check for  Price
                    if (dataObj[0].product.price.o_price) {
                        addElementToDocument('price', dataObj[0].product.price.f_price.toString().replace('.', ','));
                    } else {
                        if (dataObj[0].product.price.final) {
                            addElementToDocument('price', dataObj[0].product.price.final.toString().replace('.', ','));
                        } else {
                            addElementToDocument('price', '');
                        }
                    }
                    // Check for the product id  and append to DOM
                    if (dataObj[0].product.id) {
                        if (dataObj[0].product.id.match(/[0-9](.*)___/)) {
                            const retailerProductCode = dataObj[0].product.id.match(/[0-9](.*)___/)[1];
                            addElementToDocument('retailer_product_code', retailerProductCode);
                        }
                    }
                }
            }

            function getPathDirections(xpathToExecute) {
                var result = [];
                var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
                    result.push(JSON.parse(nodesSnapshot.snapshotItem(i).textContent));
                }
                return result;
            }

            function videoData(data) {

                if (data[0].playlist.length > 1) {
                    return data[0].playlist.map(e => { return "https:" + e.file }).join(" | ")
                }

                if (data[0].playlist.length === 1) {
                    return data.map(e => { return "https:" + e.playlist[0].file }).join(" | ")
                }
            }

            // let videos = getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value') ? videoData(getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value')) : "";

            // let apluseImages = getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value') ? getPathDirections('//div[contains(@class,"fullJwPlayerWarp")]/input/@value').map(e => { return e.playlist.length > 1 ? e.playlist.map(i => { return "https:" + i.image }) : "https:" + e.playlist[0].image }).join(" | ") : "";

            // addElementToDocument('videos', videos);
            // addElementToDocument('apluseImages', apluseImages);
            // Secondry Image
            const alternateImages = [];
            document.querySelectorAll('link[as=image]').forEach(e => {
                alternateImages.push(e.href);
            });
            addElementToDocument('alternateImages', alternateImages.slice(1).join(' | ').replace(/210x210/gm, '1200x1200'));
            // Specifications
            const description = document.querySelector('.product_detail-description-in-image');
            textContent(description, 'bulletDescription');
            textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');

            // Specifications
            const specifcations = [];
            const specXpath = document.querySelectorAll('#tab-content-0 > div > dl > div');
            if (specXpath.length > 0) {
                specXpath.forEach(e => {
                    specifcations.push(`${Array.from(e.children, ({ textContent }) => textContent).filter(Boolean)} `);
                });
                addElementToDocument('bulletDescription', specifcations.join(" ").replace(/\,/g, " "));
            } else {
                specXpath.forEach(e => {
                    specifcations.push(`${Array.from(e.children, ({ textContent }) => textContent).filter(Boolean)}`);
                });
                addElementToDocument('bulletDescription', specifcations.join(" ").replace(/\,/g, " "));
            }

            // zoom Image

            const ZoomImage = '//img/@data-zoom';
            findJsonObj('', ZoomImage);
            if (findJsonObj('', ZoomImage).snapshotLength > 0) {
                addElementToDocument('imageZoomFeaturePresent', 'Yes');
            } else {
                addElementToDocument('imageZoomFeaturePresent', 'No');
            }

            // Get the ratingCount
            function ratingFromDOM() {
                const reviewsCount = document.querySelector('div.bv-content-pagination-pages-current');
                let ratingCount;
                if (reviewsCount) {
                    ratingCount = reviewsCount.textContent.trim().match(/[^\s]+(?=\sOpiniones)/);
                    if (ratingCount) {
                        return ratingCount[0];
                    }
                } else if (document.querySelector('h4[itemprop="headline"]')) {
                    ratingCount = document.querySelector('h4[itemprop="headline"]').textContent.trim().match(/\d+/);

                    if (ratingCount) {
                        if (document.querySelector('li[itemprop="review"]')) {
                            ratingCount = parseInt(ratingCount[0]) + document.querySelectorAll('li[itemprop="review"]').length;
                        }
                        return ratingCount;
                    }
                } else if (document.querySelector('li[itemprop="review"]')) {
                    ratingCount = document.querySelectorAll('li[itemprop="review"]').length;
                    if (ratingCount) {
                        return ratingCount;
                    }
                }
            }

            function allergyAdvice() {
                const xpath = '//*[contains(text(),"Ingredientes y alérgensos")]/../ul/li';
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    const allElements = [...element.querySelectorAll('b')];
                    const allergyAdvice = allElements.map(i => i.textContent).join(' ');
                    addElementToDocument('allergyAdvice ', allergyAdvice);
                }
            }
            allergyAdvice();

            // Function to remove the `\n` from the textContent
            function textContent(element, attributeName) {
                const text = (element && element.innerText.trim()
                        .split(/[\n]/)
                        .filter((ele) => ele)
                        .join(' ')) ||
                    '';
                addElementToDocument(attributeName, text);
            }


            textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');
        });

        await context.extract(productDetails, { transform });
    },
};