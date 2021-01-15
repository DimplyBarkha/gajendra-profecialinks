const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    transform,
    domain: 'elcorteingles.es',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const sectionsDiv = 'h1[id="js-product-detail-title"]';

    const isRedirected = await context.evaluate(async function () {
      const homePage = 'https://www.elcorteingles.es/perfumeria/';
      return window.location.href === homePage;
    });

    if (isRedirected) {
      console.log('Redirected to home page');
      return false;
    } else {
      console.log('Correct page is loaded');
    }

    try {
      await context.waitForSelector(sectionsDiv, { timeout: 90000 });
    } catch (error) {
      console.log(`sectionsDiv selector: ${sectionsDiv} not found..seems like not a product page`);
      return;
    }

    try {
      await context.evaluate(async function () {
        // function to append the elements to DOM
        function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }

        // function to get the json data from the string
        function findJsonData (scriptSelector, startString, endString) {
          try {
            const xpath = `//script[contains(.,'${scriptSelector}')]`;
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const scriptContent = element.textContent;
            const startIdx = scriptContent.indexOf(startString);
            const endIdx = scriptContent.indexOf(endString);
            let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
            jsonStr = jsonStr.trim();
            return JSON.parse(jsonStr);
          } catch (error) {
            console.log('Failed to find JSON Data ', error.message);
          }
        }

        // function to get the json data from the textContent
        function findJsonObj (scriptSelector, video) {
          if (video) {
            var result = document.evaluate(video, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            return result;
          } else {
            const xpath = `//script[contains(.,'${scriptSelector}')]`;
            try {
              const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              let jsonStr = element.textContent;
              jsonStr = jsonStr.trim();
              return JSON.parse(jsonStr);
            } catch (error) {
              console.log(`xpath element not found: ${xpath}`);
              console.log(error.message);
            }
          }
        }

        const makeApiCall = async (url, options) => {
          try {
            console.log(`Making API call to => ${url}`);
            if (!options) {
              options = {
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
              };

              // return await (await fetch(url, options)).json();
              const response = await fetch(url, options);
              if (response.status != 500) {
                return await (response).json();
              } else {
                return;
              }
            }

            // return await (await fetch(url, options)).text();
            const response = await fetch(url, options);
            if (response.status != 500) {
              return await (response).text();
            } else {
              return;
            }
          } catch (err) {
            console.log('Error while making API call.', err);
          }
        };

        function setAttributes (el, attrs) {
          for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
          }
        }

        const imageData = findJsonObj('image');
        // Check for the data and append to DOM
        if (imageData) {
          addElementToDocument('product_image', `https:${imageData.image.slice(-1)[0]}`);
          addElementToDocument('product_description', imageData.description);
        }

        const getXpath = (xpath, prop) => {
          const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
          let result;
          if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
          else result = elem ? elem.singleNodeValue : '';
          return result && result.trim ? result.trim() : result;
        };

        function getPathDirections (xpathToExecute) {
          var result = [];
          var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
            result.push(nodesSnapshot.snapshotItem(i).textContent);
          }
          return result;
        }
        const directions = getPathDirections('//div[contains(@class,"product_detail-description-in-image")]/strong[contains(text(),"Modo de aplicación:") or contains(text(),"Modo de")]/following-sibling::p | //dt[contains(text(),"Modo de")]/following-sibling::dd[1] | //strong[contains(text(),"Modo")]/following-sibling::* | //div[contains(@class,"product_detail-description")]//p[contains(.,"Modo de")]/following-sibling::p');
        addElementToDocument('directions', directions ? directions.join(' ') : '');

        function nameExtended () {
          const getXpath = (xpath, prop) => {
            const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
            let result;
            if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
            else result = elem ? elem.singleNodeValue : '';
            return result && result.trim ? result.trim() : result;
          };

          const name = getXpath('//h1[@id="js-product-detail-title"]', 'textContent') ? getXpath('//h1[@id="js-product-detail-title"]', 'textContent') : '';
          return name;
        }

        // For FirstVariant
        const firstVariant = getXpath('//div[@id="variants_container"]//select//option[@color][1]/@value', 'nodeValue');
        addElementToDocument('firstVariant', firstVariant);

        // elements from data Layer object
        const dataObj = findJsonData('dataLayer', '=', ';');
        // Check for the data and append to DOM
        if (dataObj) {
          if (dataObj[0].product) {
            if (dataObj[0].product.status.toLowerCase() === 'available' || dataObj[0].product.status.toLowerCase() === 'add' || dataObj[0].product.status.toLowerCase() === 'mixed') {
              addElementToDocument('availability', 'In Stock');
            } else {
              addElementToDocument('availability', 'Out Of Stock');
            }
            // Check for the brand  and append to DOM
            if (dataObj[0].product.brand) {
              addElementToDocument('brand', dataObj[0].product.brand);
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

        function variantInformation (variantsData) {
          if (variantsData && variantsData.variant && variantsData.variant[1]) {
            if (variantsData.variant[0]) {
              return variantsData.variant[1].value + '-' + variantsData.variant[0].value;
            }
          } else if(variantsData && variantsData.variant) {
            return variantsData.variant[1] ? variantsData.variant[1].value : '' + '' + variantsData.variant[0] ? variantsData.variant[0].value : '';
          }
        }

        function getAvailability (variants) {
          if (variants) {
            if (variants.status.toLocaleLowerCase() === 'add') {
              return 'In Stock';
            } else if (variants.status.toLocaleLowerCase() === 'available') {
              return 'In Stock';
            } else if (variants.status.toLocaleLowerCase() === 'mixed') {
              return 'In Stock';
            } else {
              return 'Out Of Stock';
            }
          } else {
            return 'Out Of Stock';
          }
        }

        // Number of reviews and rating
        const passKey = 'caBFucP0zZYZzTkaZEBiCUIK6sp46Iw7JWooFww0puAxQ';
        const productAvailablity = '//div[contains(@class,"product_detail-purchase")]//div[contains(@class,"product_detail-add_to_cart")]//span[@class="dataholder"]/@data-json';
        const jsonObj = findJsonObj('', productAvailablity) && findJsonObj('', productAvailablity).snapshotItem(0) && findJsonObj('', productAvailablity).snapshotItem(0).value;

        const productID = jsonObj ? JSON.parse(jsonObj).code_a.trim('') : '';
        const sku = jsonObj ? JSON.parse(jsonObj).variant.trim('') : '';
        const storeId = jsonObj ? JSON.parse(jsonObj).store_id.trim('') : '';

        const reviewData = `https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=${passKey}&productid=${productID}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=es_ES`;
        const apiReviewResponse = await makeApiCall(reviewData, {});
        console.log(`apiReviewResponse : ${JSON.stringify(apiReviewResponse)}`);
        const apiReviewResponseJson = JSON.parse(apiReviewResponse);
        const responseRatingCount = apiReviewResponseJson ? apiReviewResponseJson.reviewSummary.numReviews : ratingFromDOM();
        const responseReviewRating = apiReviewResponseJson ? parseFloat(apiReviewResponseJson.reviewSummary.primaryRating.average).toFixed(1).replace('.', ',')
          : '';
        addElementToDocument('ratingCount', responseRatingCount);
        addElementToDocument('aggregateRating', responseReviewRating);

        const productsData = `https://www.elcorteingles.es/api/product/${productID}?product_id=${productID}&store_id=${storeId}&original_store=${storeId}`;
        const apiDataResponse = await makeApiCall(productsData, {});
        // console.log(`apiDataResponse : ${JSON.stringify(apiDataResponse)}`);
        // Check if the product has color variants are not
        const numColors = document.querySelectorAll('ul.colors_list li') && document.querySelectorAll('ul.colors_list li').length ? document.querySelectorAll('ul.colors_list li').length : 0;
        const isColorVariant = Boolean(numColors > 0);
        addElementToDocument('SKU', JSON.parse(apiDataResponse).id);
        const mpc = JSON.parse(apiDataResponse) && JSON.parse(apiDataResponse)._product_model ? JSON.parse(apiDataResponse)._product_model : '';
        addElementToDocument('mpc', mpc);
        addElementToDocument('promotion', JSON.parse(apiDataResponse).discount ? '-' + JSON.parse(apiDataResponse).discount + '%' : '');

        // Append a UL and LI tag append the variant info in the DOM
        let allVariantsData = [];
        if (isColorVariant) {
          const variants = JSON.parse(apiDataResponse) && JSON.parse(apiDataResponse)._all_colors ? JSON.parse(apiDataResponse)._all_colors  : '';
          if (variants.length > 0) {
            variants.forEach(ele => {
              const tempVariantData = ele && ele.skus && ele.skus[0] ? ele.skus[0] : '';
              allVariantsData.push(tempVariantData);
            });
          }
        } else {
          const variants = JSON.parse(apiDataResponse) && JSON.parse(apiDataResponse).skus ? JSON.parse(apiDataResponse).skus : '';
          if (variants.length > 0) {
            variants.forEach(ele => allVariantsData.push(ele));
          }
        }
        const targetElement = document.querySelector('body');
        const newUl = document.createElement('ul');
        newUl.id = 'variantsadd';
        targetElement.appendChild(newUl);
        const ul = document.querySelector('#variantsadd');
        const name = nameExtended(); // same for all variant
        const variantIds = [];
        if (allVariantsData) {
          allVariantsData.forEach(q => {
            if (q && q.reference_id) {
              variantIds.push(q.reference_id.trim());
            }
          });
        }
        console.log(`variantIds : ${variantIds}`);
        try {
          if (allVariantsData.length > 0) {
            for (let i = 0; i < allVariantsData.length; i++) {
              const listItem = document.createElement('li');
              const variantSKU = allVariantsData && allVariantsData[i] ? allVariantsData[i] : '';
              console.log(`variantSKU : ${JSON.stringify(variantSKU)}`);
              const color = variantSKU && variantSKU.color && variantSKU.color.title ? variantSKU.color.title : '';
              const gtin = variantSKU && variantSKU.gtin ? variantSKU.gtin : '';
              const retailer_product_code = variantSKU && variantSKU.reference_id ? variantSKU.reference_id : '';
              const variantinformation = variantSKU ? variantInformation(variantSKU) : '';
              const availability = variantSKU ? getAvailability(variantSKU) : '';
              const variantInfo = {
                nameExtended: name,
                color,
                gtin,
                retailer_product_code,
                variantinformation, // variantInformation,
                variantDetails: variantIds.join(' | '), // variants
                variantcount: allVariantsData.length, // variantCount
                availability, // availabilityText
              };
              console.log(`variantInfo: ${JSON.stringify(variantInfo)}`);

              setAttributes(listItem, variantInfo);
              ul.appendChild(listItem);
            }
          }
        } catch (err) {
          console.log(JSON.stringify(err), 'api');
          throw 'API Needs a change';
        }

        function ratingFromDOM () {
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

        function allergyAdvice () {
          const xpath = '//*[contains(text(),"Ingredientes y alérgensos")]/../ul/li';
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (element) {
            // @ts-ignore
            const allElements = [...element.querySelectorAll('b')];
            const allergyAdvice = allElements.map(i => i.textContent).join(' ');
            addElementToDocument('allergyAdvice ', allergyAdvice);
          }
        }
        allergyAdvice();

        // Function to remove the `\n` from the textContent
        function textContent (element, attributeName) {
          const text = (element && element.innerText.trim()
            .replace(' ', '\n')
            .split('\n')
            .filter((ele) => ele)
            .join(' ')) ||
                        '';
          addElementToDocument(attributeName, text);
        }

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
          addElementToDocument('bulletDescription', specifcations.join(' ').replace(/\,/g, ' '));
        } else {
          specXpath.forEach(e => {
            specifcations.push(`${Array.from(e.children, ({ textContent }) => textContent).filter(Boolean)}`);
          });
          addElementToDocument('bulletDescription', specifcations.join(' ').replace(/\,/g, ' '));
        }
      });
    } catch (error) {
      console.log('Evaluation Failed', error);
    }

    await context.extract(productDetails, { transform });
  },
};
