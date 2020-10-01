const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'stakelums',
    transform: cleanUp,
    domain: 'stakelums.ie',
    zipcode: '',
  },
  implementation :async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
  
    await context.evaluate(async function () {

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const image_xpath = '//div[@id="product-page"]//div[@id="product-images"]//div[@class="big-image "]//img/@src';
      const image = getAllXpath(image_xpath, 'nodeValue'); 
      addHiddenDiv('add_image',image);

      const image_alt_xpath = '//div[@id="product-images"]//div[contains(@class,"big-image")]//a/img/@alt';
      const imageAlt = getAllXpath(image_alt_xpath, 'nodeValue');
      addHiddenDiv('add_imageAlt',"hproductname");

      const metaKeywords_xpath = '//meta[contains(@name, "Keywords")]/@content';
      const metaKeywords = getAllXpath(metaKeywords_xpath, 'nodeValue'); 
      addHiddenDiv('add_metaKeywords',metaKeywords); 

      const nameExtended_xpath ='//*[@class="page-title"]';
      const nameExtended = getAllXpath(nameExtended_xpath, 'innerText');  
      addHiddenDiv('add_nameExtended',nameExtended);

      const price_xpath ='//span[@class="product-price"]';
      const price = getAllXpath(price_xpath, 'innerText');
      if(price!=null){
        let priceData=price.toString().trim().replace("(Price includes VAT)", "");
        addHiddenDiv('add_price',priceData);
      }
    
      const listprice_xpath ='//span[@class="rrp-price"]';
      const listprice = getAllXpath(listprice_xpath, 'innerText');
      if(listprice!=null){
        let listPriceData=listprice.toString().trim().split(" ");
        addHiddenDiv('add_listprice',listPriceData[1]);
      }
   
      const productReview_xpath = "//div[@class='product_review']//span/@class";
      const productReview = getAllXpath(productReview_xpath, 'nodeValue');
      let ratingCount=parseInt(productReview.toString().substring(productReview.toString().lastIndexOf("_")+1));
      if(ratingCount!=0 && ratingCount>9){
        addHiddenDiv('aggregate_rating',ratingCount/10);
      }
      else {
        addHiddenDiv('aggregate_rating',ratingCount);
      }

      const description_xpath="//div[@class='product_review']/following-sibling::p";
      let description = getXpath(description_xpath, 'innerText');
      const additional_description_xpath = "//div[@id='specificationTab']/p";
      let additional_description = getAllXpath(additional_description_xpath, 'innerText').join('|');
      
      const weight_xpath = '//div[@id="specificationTab"]//table/tbody/tr[2]/td[2]/p[text()]';
      let weight_xpath_str = getXpath(weight_xpath, 'innerText');

      let weight_xpath_other = "//div[@id='specificationTab']//p[@class='product-specificationlabel-top'][5]";
      let weight_xpath_other_str = getXpath(weight_xpath_other, 'innerText');

      addHiddenDiv('added_variantCount', 0);
      console.log(weight_xpath_other_str);


      if(weight_xpath_other_str!=null && weight_xpath_other_str!="" )
      {

        let weightData= weight_xpath_other_str.toString().trim().split(" ");
        addHiddenDiv('product_weight',weightData[2]+" Kg");
        
        const manufacturerDescription_xpath = "//div[contains(@class,'flix-d-p')]";
        const manufacturerDescription_str = getAllXpath(manufacturerDescription_xpath, 'innerText');
        addHiddenDiv('added_manufacturerDescription', manufacturerDescription_str);

        let specifications_xpath = "//div[@id='specificationTab']/p";
        let specifications_str = getAllXpath(specifications_xpath, 'innerText').join('||');
        addHiddenDiv('added_specifications', specifications_str);

        addHiddenDiv('product_other_information',additional_description);

        let final_additional_description=description+"|"+additional_description;
        const additional_description_list = final_additional_description.split('|');
        additional_description_list.forEach(function(description) {
          addHiddenDiv('additional_description',description);
        });
      }
      else if(weight_xpath_str!="" && weight_xpath_str!=null) {

         //www.stakelums.ie/product/v7-total-clean/
 
        const dimension_xpath = '//div[@id="specificationTab"]//table/tbody/tr[5]/td[2]/p[text()]';
        let dimension_xpath_str = getXpath(dimension_xpath, 'innerText');

        addHiddenDiv('product_weight',weight_xpath_str+" Kg");
        let dimensionList=dimension_xpath_str.split("/");
        addHiddenDiv('product_dimension',dimensionList[0]+"x"+dimensionList[1]+"x"+dimensionList[2]);

        const shippingweight_xpath = '//div[@id="specificationTab"]//table/tbody/tr[3]/td[2]/p[text()]';
        let shippingweight_str = getXpath(shippingweight_xpath, 'innerText');
        addHiddenDiv('shipping_weight',shippingweight_str);
    
        let specifications_xpath = "//div[@id='specificationTab']//table/tbody/tr";
        let specifications_str = getAllXpath(specifications_xpath, 'innerText').join('||');
        addHiddenDiv('added_specifications', specifications_str);

        const manufacturerDescription_xpath = "//div[contains(@class,'flix-d-p')]";
        const manufacturerDescription_str = getAllXpath(manufacturerDescription_xpath, 'innerText');
        addHiddenDiv('added_manufacturerDescription', manufacturerDescription_str);

        const additional_feature_xpath ="//div[@id='specificationTab']/ul/li";
        let additional_feature_str = getAllXpath(additional_feature_xpath, 'innerText').join('|');
        
        additional_description=additional_description+"|"+additional_feature_str;
        addHiddenDiv('product_other_information',additional_description);
        
        let final_additional_description=description+"|"+additional_description;
        const additional_description_list = final_additional_description.split('|');
        additional_description_list.forEach(function(description) {
          addHiddenDiv('additional_description',description);
        });
      }
      else {

        const shippingSpecification = document.querySelectorAll('.inpage_selector_specification .flix-std-table .flix-std-specs-table .flix-title');
        let dimension="";
        let weight="";
        shippingSpecification.forEach((item)=>{
          if(item.textContent.includes("kg")){
            weight=item.textContent;
            addHiddenDiv('product_weight',weight);
          }else if(item.textContent.includes("mm")){
            dimension+=item.textContent +"X";
          }
        });
        dimension=dimension.slice(0,-1);
      //  addHiddenDiv('product_dimension',dimension);
        if(weight==""){
            const shippingWeight = document.querySelectorAll('.inpage_selector_specification .flix-std-specs-table .flix-title');
            shippingWeight.forEach((item)=>{
            if(item.textContent.includes("KG") || item.textContent.includes("kg")){
            weight=item.textContent;
            }
            });
            addHiddenDiv('product_weight',weight);
        }
      const specifications_xpath = "//table[@class='flix-std-specs-table']/tbody/tr";
      let specifications_str = getAllXpath(specifications_xpath, 'innerText').join('||');

      const specifications_part = getXpath("//div[@id='flix-inpage']//div[@id='inpage_container']//iframe",'innerText');
      if(specifications_part){
        
        specifications_str = specifications_str.concat(specifications_part);
      }
      addHiddenDiv('added_specifications', specifications_str);
      const manufacturerDescription_xpath = "//div[@class='flix-Text-block']";
      const manufacturerDescription_str = getAllXpath(manufacturerDescription_xpath, 'innerText');

      const manufacturerDescription_tool_xpath = "//div[contains(@class,'flix-std-content')]//div[contains(@class,'flix-std-desc')]";
      const manufacturerDescription_tool_str = getAllXpath(manufacturerDescription_tool_xpath, 'innerText');
      addHiddenDiv('added_manufacturerDescription', manufacturerDescription_str+" "+manufacturerDescription_tool_str);
  
      addHiddenDiv('product_other_information',additional_description);

       /*const production_description_list = additional_description.split('||');

        production_description_list.forEach(function(data) {
          addHiddenDiv('product_other_information',data);
        });*/
        
        let final_additional_description=description+"|"+additional_description;
        const additional_description_list = final_additional_description.split('|');
        additional_description_list.forEach(function(description) {
          addHiddenDiv('additional_description',description);
        });

      }

     
      const video_url_path = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if(video_url_path && typeof video_url_path == 'string'){
        var video_url_obj = JSON.parse(video_url_path);
        addHiddenDiv('added_video_url', "http:"+video_url_obj.playlist[0].file);
      }
      
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
  
    return await context.extract(productDetails, { transform: parameters.transform });
  }
};
