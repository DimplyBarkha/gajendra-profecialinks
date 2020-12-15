const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'zooplus',
    transform: cleanUp,
    domain: 'zooplus.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    var searchPage;
    // eslint-disable-next-line no-inner-declarations
    async function currentPageCheck () {
      return await context.evaluate(function () {
        searchPage = document.querySelector('div#search_result') !== null;
        return searchPage;
      });
    };
    async function prodId () {
      return await context.evaluate(function () {
        var loadedUrlHash = window.location.hash;
        var rpc = (loadedUrlHash !== '') ? loadedUrlHash.split('=') : '';
        var productId = rpc.length > 0 ? (rpc[1].includes('.') ? rpc[1].split('.')[0] : rpc[1]) : '';
        const aid = document.querySelector('div#search_result div#exo-results ul#exo-result-list li h3.producttitle a[aid]').getAttribute('aid');
        const productUrl = document.querySelector('div#search_result div#exo-results ul#exo-result-list li h3.producttitle a[aid]').getAttribute('href');
        var prodDetails = {
          productID: productId,
          anchorID: aid,
          url: productUrl,
        };
        return prodDetails;
      });
    };
    async function extractor () {
      await context.evaluate(async function () {
        function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }

        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }

        // Method to Retrieve Xpath content of a Single Node
        const getXpath = (xpath, prop) => {
          const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
          let result;
          if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
          else result = elem ? elem.singleNodeValue : '';
          return result && result.trim ? result.trim() : result;
        };

        // Method to Retrieve Xpath content of a Multiple Nodes
        const getAllXpath = (xpath, prop) => {
          const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          const result = [];
          for (let index = 0; index < nodeSet.snapshotLength; index++) {
            const element = nodeSet.snapshotItem(index);
            if (element) result.push(prop ? element[prop] : element.nodeValue);
          }
          return result;
        };
        function setAttributes (el, attrs) {
          for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
          }
        }

        const image = getXpath("//div[contains(@class,'media__gallery')]//div[@id='js-first_image_loading']//img/@src", 'nodeValue');
        var imgSrc = 'https:' + image;
        addElementToDocument('addedimage', imgSrc);

        const imageAlt = getXpath("//div[contains(@class,'media__gallery')]//div[@id='js-first_image_loading']//img/@alt", 'nodeValue');
        addElementToDocument('addedimagealt', imageAlt);

        const ingrediantsNode1 = getAllXpath('//div[@id="ingredients-panel"]//p[not(@id="product__analytics")]//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//b/text()[not(contains(.,"Analytische bestandsdelen")) and normalize-space(.)] | //div[@id="ingredients-panel"]//i//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//a//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//article/text()[normalize-space(.)]', 'nodeValue').join(' ');
        const ingrediantsNode2 = getAllXpath('//div[@id="ingredients-panel"]//table[contains(@class,"product__analytical")]/tbody//tr//td | //div[@id="ingredients-panel"]//select[@id="analyticalConstituentsSelector"]/option[1]', 'innerText').join(' ');
        var ingrediantsNode = ingrediantsNode1+' '+ingrediantsNode2;
        addElementToDocument('addedingrediants', ingrediantsNode);

        const directionNode = getAllXpath('//div[@id="feedingrecommendation-panel"]//text()[normalize-space(.)]', 'nodeValue');
        addElementToDocument('addeddirection', directionNode.join(''));

        const gtin = getAllXpath('//div[contains(@class,"product__variants")]//div[@data-variant-id]//meta[@itemprop="gtin13"]/@content | //div[contains(@class,"product__variants")]//div[@data-variant-id]//meta[@itemprop="gtin12"]/@content', 'nodeValue');
        
        //additives
        const additives = getAllXpath('//div[@id="ingredients-panel"]//p[not(@id="product__analytics")]//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//b/text()[not(contains(.,"Analytische bestandsdelen")) and normalize-space(.)] | //div[@id="ingredients-panel"]//i//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//a//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//article/text()[normalize-space(.)]', 'nodeValue');
        //console.log(additives);
        var additiveStr = '';
        if(additives !== null && additives.length > 0){
          var status = false;
          for (let i = 0; i < additives.length; i++) {
            if(additives[i]=='Zusatzstoffe' || additives[i]=='Zusatzstoffe je kg:'){
              status = true;
            }else if(additives[i]=='Analytische Bestandteile'){
              status = false;
            }
            if(status==true){
              additiveStr += additives[i];
            }
          }
        }
        addElementToDocument('added_additive', additiveStr);
        


        const variantNodeInfo = document.querySelector('#productDataLayer').innerText;
        const variantObject = JSON.parse(variantNodeInfo);
        console.log(variantObject);
        const variants = variantObject.variants;       
        const sku = variantObject.product;
        const targetElement = document.querySelector('body');
        const newUl = document.createElement('ul');
        newUl.id = 'variantsadd';
        targetElement.appendChild(newUl);

        //Size
        var quantityNode = '';
        var priceperunituom = '';
        var sizeValue = variantObject.product.product_name;
            sizeValue  = sizeValue.toLocaleLowerCase();            
        if(sizeValue){
          var sizeArray = sizeValue.split(' ');        
          if( sizeArray.length > 0 ){
            if(sizeArray[sizeArray.length-1]=='g' || sizeArray[sizeArray.length-1]=='kg' || sizeArray[sizeArray.length-1]=='stk.' || sizeArray[sizeArray.length-1]=='tabletten' || sizeArray[sizeArray.length-1]=='ml' || sizeArray[sizeArray.length-1]=='stück' || sizeArray[sizeArray.length-1]=='l'){
               if(sizeArray.indexOf("x") > 0){
                quantityNode = sizeArray[sizeArray.length-4] +' x '+sizeArray[sizeArray.length-2]+' '+sizeArray[sizeArray.length-1];
                priceperunituom = sizeArray[sizeArray.length-1];
              }else{
                quantityNode = sizeArray[sizeArray.length-2] +' '+sizeArray[sizeArray.length-1];
                priceperunituom = sizeArray[sizeArray.length-1];
               }
            }
          }
        }

        function getSizeFunction(variant_name,type){
          var sizeValue = variant_name.toLocaleLowerCase();
          var quantityNode = '';
          var priceperunituom = '';
          if(sizeValue != '' && sizeValue !== undefined){
            var sizeArray = sizeValue.split(' ');                   
            if(sizeArray.length >0){
              if(sizeArray.indexOf("x")==1){
                quantityNode = sizeArray[0]+' x '+sizeArray[2] +' '+sizeArray[3];
                priceperunituom = sizeArray[sizeArray.length-2];                   
              }else if(sizeArray.indexOf("x")==2){
                quantityNode = sizeArray[1]+' x '+sizeArray[3]+' '+sizeArray[4];
                priceperunituom = sizeArray[sizeArray.length-4];
              }else if(isNaN(sizeArray[0])==false){
                quantityNode = sizeArray[0]+' '+sizeArray[1];
                priceperunituom = sizeArray[1];
              }else{
                if(sizeArray[1]  !== undefined && sizeArray[1] !=''){
                  var price = sizeArray[0].replace(",", ".");
                  var sizeunom = sizeArray[1].replace(",", "");                  
                  if(isNaN(price)==false && (sizeunom=='g' || sizeunom=='kg' || sizeunom=='stk.' || sizeunom=='tabletten' || sizeunom=='ml' || sizeunom=='stück' || sizeunom=='l')){
                    quantityNode = sizeArray[0]+' '+sizeArray[1];
                    priceperunituom = sizeArray[1];
                  }
                }  
              }
            }
            quantityNode = quantityNode.replace(/,\s*$/, "");  
            priceperunituom = priceperunituom.replace(/,\s*$/, "");
            if(type==1){              
              return quantityNode;  
            }else{
              return priceperunituom;
            }                   
          }          
        }

        //video       
        const videoNode = getXpath("//div[@class='lSSlideOuter']//ul[@id='pdplightSlider']//li[@id='video-slide']//script[contains(text(),'media__player')]","innerText");
        if(videoNode !== '' && videoNode !==undefined && videoNode !== null){
          var videoNodeArr = videoNode.split('data-src');
          if(videoNodeArr.length > 0){
            var videoNodeArrInner = videoNodeArr[1].split(');');
            if(videoNodeArrInner.length > 0){
              var video_url = videoNodeArrInner[0].replace(/['",]+/g, '');
              addElementToDocument('added_video', video_url);              
            }            
          }
        }

        //additionalDescBulletInfo
        const additionalDescBulletInfo = getAllXpath("//div[@id='description-panel']//ul//li | //div[@id='description-panel']//table//tr/td//table//tr//td","innerText");
        if(additionalDescBulletInfo !== null && additionalDescBulletInfo.length > 0){
          var bulletInfoArray = [];
          for (let i = 0; i < additionalDescBulletInfo.length; i++) {    
               
            if(additionalDescBulletInfo[i]!==null){              
              bulletInfoArray.push(additionalDescBulletInfo[i]);
            }                       
          }
          addElementToDocument('additionaldescbulletinfo', bulletInfoArray.join(' || '));
          addElementToDocument('additionaldescbulletinfocount', bulletInfoArray.length);
        }

        const descriptionNode2 = getXpath("//div[@class='pd__title']//div[@data-zta='productDescription']//meta[@itemprop='description']/@content","nodeValue");
        const descriptionNode1 = getXpath("//div[@class='clearfix']//object[@class='hidden-xs']","innerText");
        if(descriptionNode2 != '' || descriptionNode1 != ''){
          var description = descriptionNode1 +' '+descriptionNode2;
          addElementToDocument('added_description', description);
          console.log(description.replace(/\s\s+/g, ' '));
        }
        

        const calciumPerServingNode = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Kalzium']/following-sibling::td[1]","innerText");
        const magnesiumPerServing = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Magnesium']/following-sibling::td[1]","innerText");
        const sodiumPerServing = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Natrium']/following-sibling::td[1]","innerText");
        const caloriesPerServing = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='metabolisierbare Energie']/following-sibling::td[1]","innerText");
        const totalFatPerServing = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Rohfett']/following-sibling::td[1]","innerText");
        const dietaryFibrePerServing = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Rohfaser']/following-sibling::td[1]","innerText");
        const ProteinPerServing = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Rohprotein']/following-sibling::td[1]","innerText");
        const vitaminAPerserving = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Vitamin A']/following-sibling::td[1]","innerText");
        const vitaminCPerserving = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Vitamin C (Ascorbinsäure)']/following-sibling::td[1]","innerText");
        const ironPerServing = getAllXpath("//table[contains(@class,'product__analytical')]//tbody//tr//td[text()='Eisen']/following-sibling::td[1]","innerText");
        const analyticalCount = getAllXpath("//div[contains(@class,'product__variant__selector')]//select[@id='analyticalConstituentsSelector']/option","innerText");
       
        const pricePerUnit = getAllXpath("//div[@data-zta='productVariants']//div[@class='product__specialprice__text']/following-sibling::span","innerText");
        
        function pricePerUnitFun(price,type){
          var priceperunit = '';
          if(price !== null && price !==undefined){
            price = price.replace(/[{()}]/g, '');           
            var priceArray = price.split('/');
            if(priceArray.length > 1){
              if(type==1){
                priceperunit = priceArray[0];
              }else{
                priceperunit = priceArray[1];
              }
            }
          } 
          return priceperunit;
        }

        function perServingFun(nameStr,type){
          var nameval = '';
          if(nameStr !==null && nameStr !== undefined){
            var nameArray = nameStr.split(' ');
            if(nameArray.length > 0 && type==1){
              nameval = nameArray[0];              
            }else if(nameArray.length > 1 && type==0){
              var nameUom = nameArray[1].split('/'); 
              if(nameUom.length > 1){
                nameval = nameUom[0];
              }else{
                nameval = nameArray[1];
              } 
            }
          }
          return nameval;
        }

        function perCaloriesServingFun(nameStr){
          var nameval = '';
          if(nameStr !==null && nameStr !== undefined){
            var nameArray = nameStr.split('/');
            if(nameArray.length > 0){
              nameval = nameArray[0];              
            }
          }
          return nameval;
        }

        const ul = document.querySelector('#variantsadd');

        function variantInformation (item) {
          var variantInformation = [];
          for (let i = 0; i < variants.length; i++) {          
              variantInformation.push(variants[i].variant_id);           
          }
          return variantInformation.join(' | ');
        }

        try {
          if (variants.length) {
            for (let i = 0; i < variants.length; i++) {
              const listItem = document.createElement('li');     
              
              if(analyticalCount.length==0){               
                var calciumperserving = calciumPerServingNode.length > 0 ? perServingFun(calciumPerServingNode[0],1) : '';
                var calciumperservinguom = calciumPerServingNode.length > 0 ? perServingFun(calciumPerServingNode[0],0) : '';
                var magnesiumperserving = magnesiumPerServing.length > 0 ? perServingFun(magnesiumPerServing[0],1) : '';
                var magnesiumperservinguom = magnesiumPerServing.length > 0 ? perServingFun(magnesiumPerServing[0],0) : '';
                var sodiumperserving = sodiumPerServing.length > 0 ? perServingFun(sodiumPerServing[0],1) : '';
                var sodiumperservinguom = sodiumPerServing.length > 0 ? perServingFun(sodiumPerServing[0],0) : '';
                var caloriesperserving  = caloriesPerServing.length > 0	? perCaloriesServingFun(caloriesPerServing[0]) : '';
                var totalfatperserving = totalFatPerServing.length > 0	? perServingFun(totalFatPerServing[0],1) : '';
                var totalfatperservinguom = totalFatPerServing.length > 0	? perServingFun(totalFatPerServing[0],0) : '';
                var dietaryfibreperserving = dietaryFibrePerServing.length > 0 ? perServingFun(dietaryFibrePerServing[0],1) : '';
                var dietaryfibreperservinguom = dietaryFibrePerServing.length > 0 ? perServingFun(dietaryFibrePerServing[0],0) : '';
                var Proteinperserving = ProteinPerServing.length > 0 ? perServingFun(ProteinPerServing[0],1) : '';
                var Proteinperservinguom = ProteinPerServing.length > 0 ? perServingFun(ProteinPerServing[0],0) : '';
                var vitaminaperserving = vitaminAPerserving.length > 0 ? perServingFun(vitaminAPerserving[0],1) : '';
                var vitaminaperservinguom = vitaminAPerserving.length > 0 ? perServingFun(vitaminAPerserving[0],0) : '';
                var vitamincperserving = vitaminCPerserving.length > 0 ? perServingFun(vitaminCPerserving[0],1) : '';
                var vitamincperservinguom = vitaminCPerserving.length > 0 ? perServingFun(vitaminCPerserving[0],0) : '';
                var ironperserving = ironPerServing.length > 0 ? perServingFun(ironPerServing[0],1) : '';
                var ironperservinguom = ironPerServing.length > 0 ? perServingFun(ironPerServing[0],0) : '';
              }else{               
                var calciumperserving = calciumPerServingNode.length > 0 ? perServingFun(calciumPerServingNode[i],1) : '';
                var calciumperservinguom = calciumPerServingNode.length > 0 ? perServingFun(calciumPerServingNode[i],0) : '';
                var magnesiumperserving = magnesiumPerServing.length > 0 ? perServingFun(magnesiumPerServing[i],1) : '';
                var magnesiumperservinguom = magnesiumPerServing.length > 0 ? perServingFun(magnesiumPerServing[i],0) : '';
                var sodiumperserving = sodiumPerServing.length > 0 ? perServingFun(sodiumPerServing[i],1) : '';
                var sodiumperservinguom = sodiumPerServing.length > 0 ? perServingFun(sodiumPerServing[i],0) : '';
                var caloriesperserving  = caloriesPerServing.length > 0	? perCaloriesServingFun(caloriesPerServing[i]) : '';
                var totalfatperserving = totalFatPerServing.length > 0	? perServingFun(totalFatPerServing[i],1) : '';
                var totalfatperservinguom = totalFatPerServing.length > 0	? perServingFun(totalFatPerServing[i],0) : '';
                var dietaryfibreperserving = dietaryFibrePerServing.length > 0 ? perServingFun(dietaryFibrePerServing[i],1) : '';
                var dietaryfibreperservinguom = dietaryFibrePerServing.length > 0 ? perServingFun(dietaryFibrePerServing[i],0) : '';
                var Proteinperserving = ProteinPerServing.length > 0 ? perServingFun(ProteinPerServing[i],1) : '';
                var Proteinperservinguom = ProteinPerServing.length > 0 ? perServingFun(ProteinPerServing[i],0) : '';
                var vitaminaperserving = vitaminAPerserving.length > 0 ? perServingFun(vitaminAPerserving[i],1) : '';
                var vitaminaperservinguom = vitaminAPerserving.length > 0 ? perServingFun(vitaminAPerserving[i],0) : '';
                var vitamincperserving = vitaminCPerserving.length > 0 ? perServingFun(vitaminCPerserving[i],1) : '';
                var vitamincperservinguom = vitaminCPerserving.length > 0 ? perServingFun(vitaminCPerserving[i],0) : '';
                var ironperserving = ironPerServing.length > 0 ? perServingFun(ironPerServing[i],1) : '';
                var ironperservinguom = ironPerServing.length > 0 ? perServingFun(ironPerServing[i],0) : '';
              }              
                      
              setAttributes(listItem, {
                variant_name: sku.product_name,
                sku: sku.product_id,
                size: quantityNode != '' ? quantityNode : getSizeFunction(variants[i].variant_name,1),
                brand: sku.brand,
                aggregarerating: sku.average_prod_review,
                reviewcount: sku.amount_prod_reviews,
                gtin: gtin.length > 0 ? gtin[i] : '',
                retailer_product_code: variants[i].variant_id,
                variant_price: variants[i].variant_price,
                stock: variants[i].out_stock === false ? 'In Stock' : 'Out of Stock',
                varianttitle: variants.length > 1 ? variants[i].variant_name : '',
                variantdetails: variants.length > 1 ? variantInformation(variants[i]) : '', 
                variantcount: variants.length > 1 ? (variants.length) : 0,
                firstvariant: variants.length > 1 ? variants[0].variant_id : '',
                priceperunit: pricePerUnit.length > 0	? pricePerUnitFun(pricePerUnit[i],1) : '',
                priceperunituom: pricePerUnit.length > 0	? pricePerUnitFun(pricePerUnit[i],0) : '',
                calciumperserving: calciumperserving,
                calciumperservinguom: calciumperservinguom,
                magnesiumperserving: magnesiumperserving,
                magnesiumperservinguom: magnesiumperservinguom,
                sodiumperserving: sodiumperserving,
                sodiumperservinguom: sodiumperservinguom,
                caloriesperserving: caloriesperserving,
                totalfatperserving: totalfatperserving,
                totalfatperservinguom: totalfatperservinguom,
                dietaryfibreperserving: dietaryfibreperserving,
                dietaryfibreperservinguom: dietaryfibreperservinguom,
                Proteinperserving: Proteinperserving, 
                Proteinperservinguom: Proteinperservinguom,
                vitaminaperserving: vitaminaperserving,
                vitaminaperservinguom: vitaminaperservinguom,
                vitamincperserving: vitamincperserving,
                vitamincperservinguom: vitamincperservinguom,
                ironperserving: ironperserving,
                ironperservinguom: ironperservinguom,
              });
              ul.appendChild(listItem);
            }
          }
        } catch (err) {
          console.log(err, 'api');
          // eslint-disable-next-line no-throw-literal
          throw 'Variant not Available';
        }

        let scrollTop = 500;
        while (true) {
          window.scroll(0, scrollTop);
          await stall(1000);
          scrollTop += 500;
          if (scrollTop === 10000) {
            break;
          }
        };
      });
      await context.extract(productDetails, { transform: transformParam });
    }
    const page = await currentPageCheck();
    if (page) {
      const prodInfo = await prodId();
      if (prodInfo.productID === prodInfo.anchorID) {
        const url = 'https://www.zooplus.de' + prodInfo.url;
        await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
        await extractor();
      } else {
        await context.evaluate(async function () {
          var hashURL = window.location.hash;
          console.log(hashURL);
          var invalidRpc = (hashURL !== '') ? hashURL.split('=') : '';
          console.log(invalidRpc, 'invalidRpc');
          var invalidProductId = invalidRpc.length > 0 ? invalidRpc[1] : '';
          const skuElement = document.createElement('div');
          skuElement.id = 'addedsku';
          skuElement.textContent = invalidProductId;
          skuElement.style.display = 'none';
          document.querySelector('section.searchResult').appendChild(skuElement);
          const pageUrl = document.createElement('div');
          pageUrl.id = 'addedproducturl';
          pageUrl.textContent = window.location.href;
          pageUrl.style.display = 'none';
          document.querySelector('section.searchResult').appendChild(pageUrl);
        });
        await context.extract(productDetails, { transform: transformParam });
      }
    } else {
      await extractor();
    }
  },
};