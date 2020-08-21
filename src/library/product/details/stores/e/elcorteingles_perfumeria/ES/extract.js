
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    transform: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const sectionsDiv = 'h1[id="js-product-detail-title"]';
    await context.waitForSelector(sectionsDiv, { timeout: 90000 });
    try {
      await context.evaluate(async function () {

        // function to append the elements to DOM
        function addElementToDocument(key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }

        // function to get the json data from the string
        function findJsonData(scriptSelector, startString, endString) {
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
            console.log("Failed to find JSON Data ", error.message);
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

        const makeApiCall = async (url, options) => {
          try {
            console.log(`Making API call to => ${url}`);
            if (!options) {
              options = {
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' }
              };

              return await (await fetch(url, options)).json();
            }

            return await (await fetch(url, options)).text();
          } catch (err) {
            console.log('Error while making API call.', err);
          }
        };

        function setAttributes(el, attrs) {
          for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
          }
        }

        let productAvailablity = '//div[contains(@class,"product_detail-purchase")]//div[contains(@class,"product_detail-add_to_cart")]//span[@class="dataholder"]/@data-json'
        let passKey = "caBFucP0zZYZzTkaZEBiCUIK6sp46Iw7JWooFww0puAxQ";
        let productID = findJsonObj("", productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj("", productAvailablity).snapshotItem(0).value).code_a.trim("") : "";
        let sku = findJsonObj("", productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj("", productAvailablity).snapshotItem(0).value).variant.trim("") : "";
        let store_id = findJsonObj("", productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj("", productAvailablity).snapshotItem(0).value).store_id.trim("") : "";
        const imageData = findJsonObj('image');



        const productsData = `https://www.elcorteingles.es/api/product/${productID}?product_id=${productID}&skus=${sku}&store_id=${store_id}&original_store=0`;
        let apiDataResponse = await makeApiCall(productsData, {});
        let element = document.querySelectorAll('div.colors_content_mobile > ul li');
        // elements from data Layer object
        const dataObj = findJsonData('dataLayer', '=', ';');

        if (apiDataResponse) {

          // GTIN,SKU,SIZE,variantInformation
          if (element) {
            for (var i = 0; i < element.length; i++) {
              setAttributes(element[i].querySelector('a div'),
                {
                  "title": JSON.parse(apiDataResponse)._all_colors[i].title,
                  "gtin": JSON.parse(apiDataResponse)._all_colors[i].matches[0],
                  "retailer_product_code": JSON.parse(apiDataResponse)._all_colors[0].skus[0].reference_id,
                  "sku": JSON.parse(apiDataResponse).id
                });
            }
          }

        }

        // Check for the data and append to DOM
        if (imageData) {
          addElementToDocument('product_image', `https:${imageData.image.slice(-1)[0]}`);
          addElementToDocument('product_description', imageData.description);
        }


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

            // Check for List Price 
            if (dataObj[0].product.price.o_price) {
              addElementToDocument('listPrice', dataObj[0].product.price.o_price.toString().replace('.', ","));
            } else {
              addElementToDocument('listPrice', dataObj[0].product.price.original.toString().replace('.', ","));
            }

            // Check for  Price 
            if (dataObj[0].product.price.o_price) {
              addElementToDocument('price', dataObj[0].product.price.f_price.toString().replace('.', ","));
            } else {
              addElementToDocument('price', dataObj[0].product.price.final.toString().replace('.', ","));
            }
            // Check for  Brand
            if (dataObj[0].product.brand) {
              addElementToDocument('brand', dataObj[0].product.brand);
            } else {
              addElementToDocument('brand', "");
            }

          }
        }



        // Number of reviews and rating
        const reviewData = `https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=${passKey}&productid=${productID}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=es_ES`;
        let apiReviewResponse = await makeApiCall(reviewData, {});
        let responseRatingCount = JSON.parse(apiReviewResponse) ? JSON.parse(apiReviewResponse).reviewSummary.numReviews : ratingFromDOM();
        let responseReviewRating = JSON.parse(apiReviewResponse) ? parseFloat(JSON.parse(apiReviewResponse).reviewSummary.primaryRating.average).toFixed(1).replace(".", ",")
          : "";
        addElementToDocument('ratingCount', responseRatingCount);
        addElementToDocument('aggregateRating', responseReviewRating);


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

        //zoom Image 

        let ZoomImage = "//img/@data-zoom"
        findJsonObj("", ZoomImage)
        if (findJsonObj("", ZoomImage).snapshotLength > 0) {
          addElementToDocument('imageZoomFeaturePresent', "Yes");
        } else {
          addElementToDocument('imageZoomFeaturePresent', "No");
        }




        function allergyAdvice() {
          const xpath = '//*[contains(text(),"Ingredientes y alérgensos")]/../ul/li';
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (element) {
            const allElements = [...element.querySelectorAll('b')];
            const allergyAdvice = allElements.map(i => i.textContent).join(' ');
            addElementToDocument('allergyAdvice ', allergyAdvice);
          }
        } allergyAdvice();


        // Function to remove the `\n` from the textContent
        function textContent(element, attributeName) {
          const text = (element && element.textContent.trim()
            .split(/[\n]/)
            .filter((ele) => ele)
            .join(' ')) ||
            '';
          addElementToDocument(attributeName, text);
        }

        let description = document.querySelectorAll('.product_detail-description-in-image, .product_information');
        if (description.length > 1) {
          description.forEach(element => {
            textContent(element, 'bulletDescription');
          });
        }
        textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');

      });
    } catch (error) {
      throw "Evaluation Failed";
    }


    await context.extract(productDetails);
  },
};
