const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    transform: cleanUp,
    domain: 'elcorteingles.es',
    zipcode: '',
  },


  implementation: async ({ inputString }, { country, domain }, context, { productDetails, transform }) => {
    const sectionsDiv = 'h1[id="js-product-detail-title"]';
    await context.waitForSelector(sectionsDiv, { timeout: 90000 });
    let currentUrl = await context.evaluate(() => {
      return document.querySelector('meta[name="twitter:url"]').getAttribute('content');
    });
    let iframeUrl = '';
    let additionalDesc = '';
    let additionalDescBulletCount = 0;
    try{
      await context.waitForSelector('#loadbeeTabContent');
      iframeUrl = await context.evaluate(()=>{
        return document.querySelector('#loadbeeTabContent').getAttribute('src');
      });
      await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
      await context.waitForNavigation();
      additionalDesc = await context.evaluate(()=>{
        //@ts-ignore
        let additionalDescArray = [...document.querySelectorAll('div.container-fluid.hero ul>li')];
        for(let  i = 0 ; i < additionalDescArray.length ; i ++){
          additionalDescArray[i] = additionalDescArray[i].innerText;
        }
        return additionalDescArray.join(' || ');
      });
      additionalDescBulletCount = await context.evaluate(()=>{
        //@ts-ignore
        return [...document.querySelectorAll('div.container-fluid.hero ul>li')].length;
      });
    }catch(err){
      console.log('iframe not present');
    }
    await context.goto(currentUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
    await context.waitForNavigation();
    console.log('descrption - ', additionalDesc);
    await context.evaluate((additionalDescBulletCount,additionalDesc)=>{
      document.querySelector('body').setAttribute('bullet',additionalDescBulletCount);
      document.querySelector('body').setAttribute('desc',additionalDesc);
    },additionalDescBulletCount,additionalDesc);
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


      let productAvailablity = '//div[contains(@class,"product_detail-purchase")]//div[contains(@class,"product_detail-add_to_cart")]//span[@class="dataholder"]/@data-json'
      let passKey = "caBFucP0zZYZzTkaZEBiCUIK6sp46Iw7JWooFww0puAxQ";
      let productID = findJsonObj("", productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj("", productAvailablity).snapshotItem(0).value).code_a.trim("") : "";
      let sku = findJsonObj("", productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj("", productAvailablity).snapshotItem(0).value).variant.trim("") : "";
      let store_id = findJsonObj("", productAvailablity).snapshotItem(0).value ? JSON.parse(findJsonObj("", productAvailablity).snapshotItem(0).value).store_id.trim("") : "";
      //API
      const productsData = `https://www.elcorteingles.es/api/product/${productID}?product_id=${productID}&skus=${sku}&store_id=${store_id}&original_store=0`;
      let apiDataResponse = await makeApiCall(productsData, {});
      console.log("Great")
      console.log(JSON.parse(apiDataResponse), "chec")
      if (apiDataResponse) {
        if (JSON.parse(apiDataResponse)._product_model) {
          document.querySelector('.sku-model').textContent = `MODELO: ${JSON.parse(apiDataResponse)._product_model}`;
        }
        addElementToDocument('mpc', JSON.parse(apiDataResponse)._product_model);
        addElementToDocument('sku', JSON.parse(apiDataResponse).id);
        addElementToDocument('gtin', JSON.parse(apiDataResponse)._datalayer[0].product.gtin);
        addElementToDocument('retailer_product_code', JSON.parse(apiDataResponse)._datalayer[0].product.variant);

      }


      // Number of reviews and rating
      const reviewData = `https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=${passKey}&productid=${productID}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=es_ES`;
      let apiReviewResponse = await makeApiCall(reviewData, {});
      let responseRatingCount = JSON.parse(apiReviewResponse) ? JSON.parse(apiReviewResponse).reviewSummary.numReviews : ratingFromDOM();
      let responseReviewRating = JSON.parse(apiReviewResponse) ? parseFloat(JSON.parse(apiReviewResponse).reviewSummary.primaryRating.average).toFixed(1).replace(".", ",")
        : "";
      addElementToDocument('ratingCount', responseRatingCount);
      addElementToDocument('aggregateRating', responseReviewRating);


      const imageData = findJsonObj('image');
      // Check for the data and append to DOM
      if (imageData) {
        addElementToDocument('product_image', `https:${imageData.image.slice(-1)[0]}`);
        addElementToDocument('product_description', imageData.description);
      }

      // Get the video 
      try {
        let inputVideo = findJsonObj("", '//input[@class="flix-jw"]/@value');
        let imagelayoutVideo = findJsonObj("", '//div[@class="image-layout-slides-group-item"]/img/@data-url');
        await context.waitForSelector('.flix-jw', { timeout: 90000 });
        if (inputVideo.snapshotLength > 0) {
          for (let i = 0; i < inputVideo.snapshotLength; i++) {
            addElementToDocument('video', JSON.parse(findJsonObj("", inputVideo).snapshotItem(0).value).playlist[0].file);
          }
        } else {
          if (imagelayoutVideo.snapshotLength = 1) {
            addElementToDocument('video', imagelayoutVideo.snapshotItem(0).value);
          } else {
            for (let i = 0; i < imagelayoutVideo.snapshotLength; i++) {
              addElementToDocument('video', imagelayoutVideo.snapshotItem(0).value);

            }
          }
        }
      } catch (error) {
        console.log(error.message);
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
          if (dataObj[0].product.brand) {
            addElementToDocument('retailer_product_code', dataObj[0].product.id);
          }

          // Check for the brand  and append to DOM
          if (dataObj[0].product.brand) {
            addElementToDocument('sku', dataObj[0].product.code_a);
          }

          // Check for List Price 
          try{
          if (dataObj[0].product.price.o_price) {
            addElementToDocument('listPrice', dataObj[0].product.price.o_price.toString().replace('.', ","));
          } else {
            addElementToDocument('listPrice', dataObj[0].product.price.original.toString().replace('.', ","));
          }}catch(err){
            console.log('No List price')
          }

          // Check for  Price 
          try{
          if (dataObj[0].product.price.o_price) {
            addElementToDocument('price', dataObj[0].product.price.f_price.toString().replace('.', ","));
          } else {
            addElementToDocument('price', dataObj[0].product.price.final.toString().replace('.', ","));
          }}catch(err){
            console.log('Price not available')
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


      //zoom Image 

      let ZoomImage = "//img/@data-zoom"
      findJsonObj("", ZoomImage)
      if (findJsonObj("", ZoomImage).snapshotLength > 0) {
        addElementToDocument('imageZoomFeaturePresent', "Yes");
      } else {
        addElementToDocument('imageZoomFeaturePresent', "No");
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
          //@ts-ignore
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

    await context.extract(productDetails, { transform });
  },
};
