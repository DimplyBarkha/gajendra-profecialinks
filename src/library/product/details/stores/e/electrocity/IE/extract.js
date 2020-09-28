const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'electrocity',
    transform: cleanUp,
    domain: 'electrocity.ie',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
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

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
      const product_name = getXpath("//h1[contains(@class, 'product_title')]/text()", 'nodeValue');
      
      if(product_name && typeof product_name == 'string'){
        const mpc = product_name ? product_name.split('| ') : [];
        addElementToDocument('added_mpc', mpc[1]);
      }

      const alternate_image_xpath = "//div[@class='slick-track']//div[contains(@class,'slick-slide')]//div[@class='jet-woo-product-gallery__image ']//a[@class='jet-woo-product-gallery__image-link']/@href";
      const alternate_image_str =  getAllXpath(alternate_image_xpath, 'nodeValue').join(',');
      if(alternate_image_str && typeof alternate_image_str == 'string'){
        const alternate_image_list = alternate_image_str.split(',');
        var unique_alternate_image_list = alternate_image_list.filter(function(item, pos){
          return alternate_image_list.indexOf(item)== pos; 
        });
        unique_alternate_image_list.forEach(function(image_url_data) {
          addElementToDocument('added_alternate_image', (image_url_data));   
        });       
      }

      const shipping_dimensions = getXpath("//tr[@class='attribute-key-Dimensions']/td/p", 'innerText');
      if(shipping_dimensions && typeof shipping_dimensions == 'string') {
        addElementToDocument('added_shipping_dimensions', (shipping_dimensions.split('Weight'))[0]);  
      }

      const other_description_xpath = "//div[@class='elementor-widget-wrap']//div[contains(@class, 'elementor-element')]//table[@class='shop_attributes']/tbody/tr[position()>1]";
      const other_description_str = getAllXpath(other_description_xpath, 'innerText').join(' | ');
      addElementToDocument('added_productOtherInformation', other_description_str); 

      const specifications_xpath = "//table[@class='flix-std-specs-table']/tbody/tr";
      var specifications_str = getAllXpath(specifications_xpath, 'innerText').join(',');

      const specifications_part = getXpath("//div[@id='flix-inpage']//div[@id='inpage_container']//iframe",'innerText');
      if(specifications_part){
        specifications_str = specifications_str.concat(specifications_part);
      }
      addElementToDocument('added_specifications', specifications_str);

      const ratingCount =  getXpath("//span[@class='yotpo-sum-reviews']//span[contains(concat(' ', normalize-space(@class), ' '), ' font-color-gray')]/text()", 'nodeValue');
      product_name ? product_name.split('| ') : [];
      const added_ratingCount = ratingCount?ratingCount.split(' Review') : [];
      if(added_ratingCount[0] > 0) {
        addElementToDocument('added_ratingCount', added_ratingCount[0]);
      }
  
      const technicalInformationPdfUrl = getXpath("//div[contains(@class, 'elementor-element-dfd5028')]//span[contains(@class, 'elementor-heading-title')]//a/@href", 'nodeValue');
      var technicalInformationPresent = 'No';
      if(technicalInformationPdfUrl && technicalInformationPdfUrl != ''){
        technicalInformationPresent = 'Yes';
      }
      addElementToDocument('added_technicalInformationPresent', technicalInformationPresent);

      const manufacturerDescription_xpath = "//div[@class='flix-Text-block']";
      var manufacturerDescription = getAllXpath(manufacturerDescription_xpath, 'innerText');
      const manufacturerDescription_part =  getAllXpath("//div[contains(@class,'flix-std-featureslist')]//div[contains(@class,'flix-std-clmn-lg-4 flix-std-clmn-sm-6')]",'innerText').join(',');
      if(manufacturerDescription_part){
        manufacturerDescription = manufacturerDescription.concat(manufacturerDescription_part);
      }
      addElementToDocument('added_manufacturerDescription', manufacturerDescription);

      const aggregateRatingTxt = getXpath('//span[@class="sr-only"]/text()', 'nodeValue');
      
      if(aggregateRatingTxt && typeof aggregateRatingTxt  == 'string' ){
        const aggregateRating = aggregateRatingTxt?aggregateRatingTxt.split(' ') : [];
        if(aggregateRating[0] != '0.0'){
          addElementToDocument('added_aggregateRating', aggregateRating[0]);
        }
        
      }

      addElementToDocument('added_variantCount', 0);

      const video_url_path = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if(video_url_path && typeof video_url_path == 'string'){
        var video_url_obj = JSON.parse(video_url_path);
        addElementToDocument('added_video_url', video_url_obj.playlist[0].file);
      }
      
      const promotion_str = getXpath("(//div[@class='elementor-widget-wrap']//div[contains(@class, 'elementor-clearfix')]/p)[1]", 'innerText');
      if(promotion_str && typeof promotion_str == 'string' && promotion_str.includes('SAVE')){
        addElementToDocument('added_promotion', promotion_str);
      }

      var weight_net_str = getXpath("//table[@class='flix-std-specs-table']", 'innerText');
      
      if(weight_net_str){
        weight_net_str = weight_net_str.toLowerCase();
        if(weight_net_str.includes('weight') && weight_net_str.includes('kg')){
          const weight_net = weight_net_str.substring(weight_net_str.lastIndexOf("weight")+7, weight_net_str.lastIndexOf("kg")+2);
          addElementToDocument('added_weight', weight_net);
        }
        
      }else{
        weight_net_str = getXpath("//tr[@class='attribute-key-Dimensions']", 'innerText');
        if(weight_net_str){
          weight_net_str = weight_net_str.toLowerCase();
          if(weight_net_str.includes('weight') && weight_net_str.includes('kg')){
              const weight_net = weight_net_str.substring(weight_net_str.lastIndexOf("weight")+7, weight_net_str.lastIndexOf("kg")+2);
              addElementToDocument('added_weight', weight_net);
          }

        }
        
      }

    });
    await context.extract(productDetails);
  },
};
