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

      addHiddenDiv('added_variantCount', 0);

      const description_xpath="//div[@class='product_review']/following-sibling::p";
      let description = getXpath(description_xpath, 'innerText');
      const additional_description_xpath = "//div[@id='specificationTab']/p";
      let additional_description = getAllXpath(additional_description_xpath, 'innerText').join('|');

      //check Weight from Specification 
      const weightSpecification = document.querySelectorAll('.inpage_selector_specification .flix-std-table .flix-std-specs-table .flix-title');
      let weight="";
        weightSpecification.forEach((item)=>{
          if(item.textContent.includes("kg")){
              weight=item.textContent;
              addHiddenDiv('product_weight',weight);
          }
        });
        if(weight==""){
            const shippingWeight = document.querySelectorAll('.inpage_selector_specification .flix-std-specs-table .flix-title');
            shippingWeight.forEach((item)=>{
             if(item.textContent.includes("KG") || item.textContent.includes("kg")){
              weight=item.textContent;
            }
            });
            if(weight!=""){
              addHiddenDiv('product_weight',weight);
            }
        }
      if(weight==""){
          //weightXpath
          let weight_xpath_option1=getXpath("//div[@id='specificationTab']//table/tbody/tr[2]/td[2]/p[text()]",'innerText');
          let weight_xpath_option2=getXpath("//div[@id='specificationTab']//p[@class='product-specificationlabel-top'][5]",'innerText');
          let weight_xpath_option3=getXpath("//div[@class='tabs-content']//p[contains(text(),'Weight')]",'innerText');
          if(weight_xpath_option1!=null)
          {
            addHiddenDiv('product_weight',weight_xpath_option1+" Kg");
          }
          else if(weight_xpath_option2!=null){
            let weightData= weight_xpath_option2.toString().trim().split(":");
            addHiddenDiv('product_weight',weightData[1]);
          }
          else if(weight_xpath_option3!=null){
            let weightData= weight_xpath_option3.toString().trim().split(":");
            addHiddenDiv('product_weight',weightData[1]);
          }
    }

    //Manufacture Description
   let manufacturerDescription_xpath_option = getAllXpath("//div[contains(@id,'inpage_container')]//div[(contains(@class,'flix-d-p') or contains(@class,'flix-std-desc')) and not(contains(@class,'flix-title')or contains(@class,'flix-caveat-desc'))]", 'innerText');
   if(manufacturerDescription_xpath_option.length>0){
    addHiddenDiv('added_manufacturerDescription', manufacturerDescription_xpath_option);
   }

   //shipping_Weight
   let shippingweight_xpath_option = getXpath('//div[@id="specificationTab"]//table/tbody/tr[3]/td[2]/p[text()]', 'innerText');
   if(shippingweight_xpath_option!=null){
    addHiddenDiv('shipping_weight',shippingweight_xpath_option);
    addHiddenDiv('addgross_weight',shippingweight_xpath_option);
   }
   //Dimension
   let dimension_xpath_option = getXpath('//div[@id="specificationTab"]//table/tbody/tr[5]/td[2]/p[text()]', 'innerText');
   if(dimension_xpath_option!=null){
    let dimensionList=dimension_xpath_option.split("/");
    addHiddenDiv('product_dimension',dimensionList[0]+"x"+dimensionList[1]+"x"+dimensionList[2]);
   }

   //Specification Xpath
   let specifications_xpath_option1 = getAllXpath("//table[@class='flix-std-specs-table']/tbody/tr/td", 'innerText');
   let specifications_xpath_option2 = getAllXpath("//div[@id='specificationTab']//table/tbody/tr", 'innerText');
   let specifications_xpath_option3 = getAllXpath("//div[@id='specificationTab']//p[@class='product-specificationlabel-top']", 'innerText');
   if(specifications_xpath_option1.length>0){
    addHiddenDiv('added_specifications', specifications_xpath_option1.join('||'));
   }
   else if(specifications_xpath_option2.length>0)
   {
    addHiddenDiv('added_specifications', specifications_xpath_option2.join('||'));
   }
   else if(specifications_xpath_option3.length>0){
    addHiddenDiv('added_specifications', specifications_xpath_option3.join('||'));
   }

   //product Information and additional Description
   let additional_xpath_option1 =getAllXpath("//div[@id='specificationTab']/ul/li",'innerText');
   let final_additional_description;
   if(additional_xpath_option1.length>0){
    //addHiddenDiv('product_other_information',additional_description+"|"+additional_xpath_option1.join('|'));
    final_additional_description=description+"|"+additional_description+"|"+additional_xpath_option1.join('|');
   }
   else {
    //addHiddenDiv('product_other_information',additional_description);
    final_additional_description=description+"|"+additional_description;
   }
   const additional_description_list = final_additional_description.split('|');
   additional_description_list.forEach(function(description) {
     addHiddenDiv('additional_description',description);
   });
   //Video
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
