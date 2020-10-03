const { cleanup } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'jccampbellelectrics',
    transform: cleanup,
    domain: 'jccampbellelectrics.com',
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

      let rating = getXpath("//div[@class='rating']/@style", 'nodeValue');
      const regexp = /\:(\w+)\%/;
      console.log('rating fetched ' + rating);
      if(rating != null){
        rating = rating.match(regexp);
        rating = rating[1];
        rating= rating * 0.05;
        console.log('rating fetched ** ' + rating);
        addElementToDocument('added_rating', rating);
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

      let video = getXpath("//div[@class='fullJwPlayerWarp']//div//input/@value", 'nodeValue');
      if(video != null){
      video = JSON.parse(video);
      video = video.playlist[0].file;
      console.log('video fetched ' + video);
      addElementToDocument('added_video', video);
    }

    let manufacturerImages = getAllXpath("//div[@class='flix-background-image inpage_wowimg' or @class='flix-background-image']/img/@srcset", 'nodeValue').join(' | ');
    
    console.log('manufacturerImages   ' + manufacturerImages);
    addElementToDocument('added_manufacturerImages', manufacturerImages);


    let manufacturerDescription = getAllXpath("//div[@class='flix-std-title flix-Header flix-d-h3' or @class='flix-std-desc flix-Body flix-d-p']/text()  |  //div[@class='flix-std-content']//div[contains(@class,'flix-std-title flix-d-h3')]//text() | //div[@class='flix-std-content']//div[contains(@class,'flix-std-desc flix-d-p')]//text()", 'nodeValue').join(' ');
    
    console.log('manufacturerDescription   ' + manufacturerDescription);
    addElementToDocument('added_manufacturerDescription', manufacturerDescription);

    let productOtherInformation = getAllXpath("//tbody//tr//th[@class='label']/text() | //tbody//tr//td[@class='data last']/text()", 'nodeValue').join('|');
    console.log('productOtherInformation  ' + productOtherInformation);
    addElementToDocument('added_productOtherInformation', productOtherInformation);
   
    let specifications = getAllXpath("//div[@class='flix-value flix-d-h3' or @class='flix-title flix-d-p']//span/text() | //p[@class='eky-specs-label-top']/text() | //p[@class='eky-specs-label-bottom']/span/text()",'nodeValue');
    console.log('specifications   ' + specifications);
    addElementToDocument('added_specifications', specifications);

    let additionalDescBulletInfo = getAllXpath("//p[contains(@class,'MsoListParagraph')]//font/text()",'nodeValue').join(' | ');
    console.log('additionalDescBulletInfo   ' + additionalDescBulletInfo);
    addElementToDocument('added_additionalDescBulletInfo', additionalDescBulletInfo);

    let description = getAllXpath("(//p[contains(@class,'MsoNormal')]//font/text() | //p[contains(@class,'MsoListParagraph')]//font/text())",'nodeValue').join(' | ');
    console.log('description   ' + description);
    addElementToDocument('added_description', description);
    

    
      // playlist
      // addElementToDocument('added_mpc', mpc[1]);cls

     
      // const alternate_image_str =  getXpath("(//div[@class='container-image-and-badge  ']//picture[contains(@class, 'wp-post-image')]/source/@srcset)[1]", 'nodeValue');
      // if(alternate_image_str && typeof alternate_image_str == 'string'){
      //   const alternate_image_list = alternate_image_str.split(',');
      //   alternate_image_list.forEach(function(image_url_data) {
      //     addElementToDocument('added_alternate_image', (image_url_data.split('.webp'))[0]);   
      //   });       
      // }

      // const shipping_dimensions = getXpath("//tr[@class='attribute-key-Dimensions']/td/p", 'innerText');
      // if(shipping_dimensions && typeof shipping_dimensions == 'string') {
      //   addElementToDocument('added_shipping_dimensions', (shipping_dimensions.split('Weight'))[0]);  
      // }

      // const other_description_xpath = "//div[@class='elementor-widget-wrap']//div[contains(@class, 'elementor-element')]//table[@class='shop_attributes']/tbody/tr[position()>1]";
      // const other_description_str = getAllXpath(other_description_xpath, 'innerText').join(',');
      // const other_description_list = other_description_str.split(',');

      // other_description_list.forEach(function(other_description) {
      //   addElementToDocument('added_productOtherInformation', other_description);   
      // });
      
      // const specifications_xpath = "//table[@class='flix-std-specs-table']/tbody/tr";
      // const specifications_str = getAllXpath(specifications_xpath, 'innerText').join(',');
      // addElementToDocument('added_specifications', specifications_str);

      // const ratingCount =  getXpath("//span[@class='yotpo-sum-reviews']//span[contains(concat(' ', normalize-space(@class), ' '), ' font-color-gray')]/text()", 'nodeValue');
      // product_name ? product_name.split('| ') : [];
      // const added_ratingCount = ratingCount?ratingCount.split(' Review') : [];
      // addElementToDocument('added_ratingCount', added_ratingCount[0]);

      // const technicalInformationPdfUrl = getXpath("//div[contains(@class, 'elementor-element-dfd5028')]//span[contains(@class, 'elementor-heading-title')]//a/@href", 'nodeValue');
      // var technicalInformationPresent = 'No';
      // if(technicalInformationPdfUrl && technicalInformationPdfUrl != ''){
      //   technicalInformationPresent = 'Yes';
      // }
      // addElementToDocument('added_technicalInformationPresent', technicalInformationPresent);

      // const manufacturerDescription_xpath = "//div[@class='flix-Text-block']";
      // const manufacturerDescription = getAllXpath(manufacturerDescription_xpath, 'innerText');
      // addElementToDocument('added_manufacturerDescription', manufacturerDescription);

     

    });
    await context.extract(productDetails);
  },
};
