const { transform } = require("../../../l/shared");

//const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bjs',
    transform: transform,
    domain: 'bjs.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(() => {
      if (document.querySelector('div.rightSection')) {
        throw new Error('Not a product Page');
      }
    });
    try{
      await context.waitForSelector('.pr-snippet-stars-reco-inline .pr-snippet-rating-decimal');
      await context.waitForSelector('.pr-snippet-stars-reco-stars');
    }catch(error){ console.log("await error..")}
   // await context.waitForSelector('.pr-snippet-stars-reco-inline .pr-snippet-rating-decimal');
    await context.waitForSelector('.productimageblock #magic-zoom-id');
    //await context.waitForSelector('.pr-snippet-stars-reco-stars');
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

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

     // await context.waitForSelector('.pr-snippet-stars-reco-inline .pr-snippet-rating-decimal');
     // await context.waitForSelector('.pr-snippet-stars-reco-stars');
    try{
      const rating = document.querySelector('.pr-snippet-stars-reco-inline .pr-snippet-rating-decimal') ? document.querySelector('.pr-snippet-stars-reco-inline .pr-snippet-rating-decimal').innerText : 0;
      console.log("rating: ", rating);
      //await new Promise(resolve => setTimeout(resolve, 300000000));
      if(rating != null){
        document.body.setAttribute('import-rating', rating);
      }
      }catch(error){
        console.log("rating Path error...");
      }

      const varienIdPath = getXpath("//link[@rel='canonical']/@href",'nodeValue');
      console.log("varienIdPath:::", varienIdPath);
      var varIdSplit = varienIdPath.split('/');
      console.log("varIdSplit:::", varIdSplit.length);
      for(var i=0; i<varIdSplit.length ;i++){
        console.log("varientId is::::", varIdSplit[(varIdSplit.length) -1]);
        addElementToDocument('varientId-added', varIdSplit[(varIdSplit.length) -1]);
      }

      const listPriceXpath = getXpath("//div[@class='online-price-and-green-price']/div/div[@_ngcontent-bjs-universal-app-c147='']/div/div/div[@class='online-Price-strike']/text()",'nodeValue');
      //console.log("listPriceXpath:: Reg $139.99 :", listPriceXpath);
      if(listPriceXpath != null){
        var listPrice = listPriceXpath.split(' ');
        //console.log("listPrice:::", listPrice[1]);
        addElementToDocument('list-price', listPrice[1]);
      }
      

      const ratingPath = getXpath("//div[@class='pr-snippet-stars-container']/div[@class='pr-snippet-stars pr-snippet-stars-png ']/div[@class='pr-snippet-rating-decimal']/text()", 'nodeValue');
      console.log("ratingPath::", ratingPath);
      //addElementToDocument('import-rating', ratingPath);

      
      const ratingXPath = getXpath("//div[@class='pr-snippet']/div/div/div[@class='pr-snippet-rating-decimal']/text()", 'textContent');
      console.log("ratingXPath::", ratingXPath);
      if(ratingXPath != null){
        addElementToDocument('import-rating', ratingXPath);
      }else{
        addElementToDocument('import-rating', "0");

      }
      
      const btext = getXpath("//script[@type='application/ld+json'][2]/text()",'nodeValue');
     //nst btext = getXpath("//html/body/app-root/div/div[2]/div/app-pdp-preprocessor/div/app-pdp-layout-template/script[2]/text()",'nodeValue');
      console.log("btext::::", btext);
      if (btext) {
        const jsonObj = JSON.parse(btext);
        //const jsonObjParse = JSON.parse(jsonObj);
        //console.log("sku::::", jsonObj.sku);
        console.log("brand::::", jsonObj.brand);
        //addElementToDocument('retailer_product_code_added', jsonObj.sku);
      }

      const mpcXpath = getXpath("//div[@class='prod-item-model-number']/span[2]/text()", 'nodeValue');
      console.log("mpc: ", mpcXpath);
      if (mpcXpath != null) {
        const mpc = mpcXpath ? mpcXpath.split(':') : [];
        addElementToDocument('mpc_added', mpc[1]);
      }

      const upcXpath1 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'upc')]/following-sibling::td[1]", 'innerText');
      const upcXpath2 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'UPC')]/following-sibling::td[1]", 'innerText');


      if (upcXpath1 != null) {
        addElementToDocument('upc_added', upcXpath1);
      } else {
        addElementToDocument('upc_added', upcXpath2);
      }

      const weightXpath1 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Item Weight')]/following-sibling::td[1]", 'innerText');
      const weightXpath2 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Weight')]/following-sibling::td[1]", 'innerText');

      if (weightXpath1 != null) {
        addElementToDocument('weight_added', weightXpath1);
      } else {
        addElementToDocument('weight_added', weightXpath2);
      }

      const quanityXpath1 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Size')]/following-sibling::td[1]", 'innerText');

      const quanityXpath2 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Unit Size')]/following-sibling::td[1]", 'innerText');
      console.log("quanityXpath1:::", quanityXpath1);
      console.log("quanityXpath2:::", quanityXpath2);
      if (quanityXpath1 != null) {
        addElementToDocument('quantity_added', quanityXpath1);
      } else {
        addElementToDocument('quantity_added', quanityXpath2);
      }

      

      const jsonstr = getXpath("//*[@id='contentOverlay']/div/app-pdp-preprocessor/div/app-pdp-layout-template/script[2]/text()", 'nodeValue');
      console.log("jsonstr:::", jsonstr);
      if (jsonstr) {
        const jsonObj = JSON.parse(jsonstr);
        console.log("sku::::", jsonObj.sku);
        console.log("brand::::", jsonObj.brand);
        addElementToDocument('retailer_product_code_added', jsonObj.sku);
      }

      const availabilitystr = getXpath("//div[@class='sticky-content']/button/text()", 'nodeValue');
      if (availabilitystr != null) {

        if (availabilitystr == "SOLD OUT") {

          addElementToDocument('availability_added', "Out of Stock");
        }
        else {

          addElementToDocument('availability_added', "In Stock");
        }
      }

      const descXpath = getXpath("//div[@class='desc-table']", 'innerText');
      addElementToDocument('desc_added', descXpath);

      const warningXpath = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Product Warnings')]/following-sibling::td[1]", 'innerText');

      addElementToDocument('warning_added', warningXpath);

      const ratingXpath = getXpath("//div[@class='pr-snippet-read-and-write']/span", 'innerText');
      if (ratingXpath != null) {

        addElementToDocument('rating_added', (ratingXpath.split(" ")[0]));
      }

      const altImageXpath = getAllXpath("//div[@class='mcs-items-container']/div[@class='mcs-item'][position()>1]/div/a/@data-image", 'nodeValue').join(' | ');
      var altImageXpathValue = altImageXpath.split('|');

      addElementToDocument('alt_image_added', altImageXpath);
      addElementToDocument('alt_image_count_added', altImageXpathValue.length);

      const specificationsXpath1 = getAllXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr", 'innerText').join(' | ');

      addElementToDocument('specification_added', specificationsXpath1);

      const meterialsXpath = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Material(s)')]/following-sibling::td[1]", 'innerText');

      addElementToDocument('meterials_added', meterialsXpath);

      const imageZoomXpath = getXpath("//div[@class='zoomcontainer']//a/@class", 'nodeValue');

      if (imageZoomXpath != null) {
        if (imageZoomXpath == "MagicZoomPlus") {
          addElementToDocument('image_zoom_added', "YES");
        }
      } else {
        addElementToDocument('image_zoom_added', "NO");
      }

      // -----------------------------
      // -----------------------------
      // --------- Salsify -----------
      // -----------------------------
      // -----------------------------

      
      const availabilityText = document.querySelector('#addtocart-target') ? 'In stock' : 'Out of stock';
      let gtin = document.querySelector('.prod-item-model-number > span:first-child') ? document.querySelector('.prod-item-model-number > span:first-child').innerText : null;
      gtin = gtin ? gtin.split(':') : null;
      gtin = gtin ? gtin[gtin.length - 1].trim() : null;
      // try{
      // const rating = document.querySelector('.pr-snippet-stars-reco-inline .pr-snippet-rating-decimal') ? document.querySelector('.pr-snippet-stars-reco-inline .pr-snippet-rating-decimal').innerText : 0;
      // console.log("rating: ", rating);
      // //await new Promise(resolve => setTimeout(resolve, 100000000));
      // if(rating != null){
      //   document.body.setAttribute('import-rating', rating);
      // }
      // }catch(error){
      //   // @ts-ignore
      //   console.log("rating: ", rating);
      // }
      let reviews = document.querySelector('.desktopOnly .product-details .reviewnum') ? document.querySelector('.desktopOnly .product-details .reviewnum').innerText : '0';
      reviews = reviews.match(/\d+/g)[0];
      document.body.setAttribute('import-seller-name', `BJ's Wholesale Club`);
      document.body.setAttribute('import-seller-availability', availabilityText);
      document.body.setAttribute('import-gtin', gtin);
     // document.body.setAttribute('import-rating', rating);
      document.body.setAttribute('import-reviews', reviews);
      document.body.setAttribute('import-enhanced-content', 'false');

      const videoItems = document.querySelectorAll('.thumbnailvideoimage');
      console.log("videoItems::::", videoItems);
      const videos = [];

      for (const video of videoItems) {
        video.click();
        await new Promise(resolve => setTimeout(resolve, 100000000));
        const videoEl = document.querySelector('video');
        if(videoEl) {
        videos.push(videoEl.src);
        }
      }

      for (const item of videos) {
        const divEl =  document.createElement('import-video');
        divEl.setAttribute('src', item);
        document.body.appendChild(divEl);
      }

      const imageEls = document.evaluate("//div[@class='productimageblock'][count(*)=1]//a[@id='magic-zoom-id']/@href | //div[@class='productimageblock'][count(*)>1]//div[@id='magic-scroll-id']/div[@class='mcs-wrapper']//div[@class='mcs-item']//a[not(contains(@href, 'javascript'))]//img/@src", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

      for (let i = 0; i < imageEls.snapshotLength; i++) {
        let imageUrl = imageEls.snapshotItem(i).textContent;
        imageUrl = imageUrl ? imageUrl.split('?')[0] : null;

        if (imageUrl) {
          const imgEl = document.createElement('import-image');
          imgEl.setAttribute('data', imageUrl);
          document.body.appendChild(imgEl);
        }
      }
      const enhancedContent = document.querySelector("#desktopDescriptiontabcontent > div.text-center.pt-2 > button");
      if(enhancedContent) {
        enhancedContent.click()
      }
    });

    await context.extract(productDetails, { transform: transformParam });
  },
};