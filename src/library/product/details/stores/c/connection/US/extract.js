const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'connection',
    transform: cleanUp,
    domain: 'connection.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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

      const size = getAllXpath("//*[@id='productSizes']/div/button", 'nodeValue');
      console.log(' size==' + size);
      if (size != null) {
        addElementToDocument('size', size.join('|'));
      }

      const retailer_code_custom = getAllXpath("//span[@aria-label='UNSPSC']",'innerText');
      if(retailer_code_custom != null) {
        addElementToDocument('retailer_added',retailer_code_custom);
      } else {
        const retailer_sku = getAllXpath("//span[@id='productSku']",'nodeValue');
        addElementToDocument('retailer_added',retailer_sku);
      }
  
      const videoUrl = getAllXpath("//div[@data-media-type='video']/@data-video-url",'value');
      if (videoUrl != null) {
        console.log(' VideoUrl==' + videoUrl);
        addElementToDocument('video_added', videoUrl.join(' | '));
      }

      const enhanced = getAllXpath("//*[@id='ccs-inline-content']//text()",'innerText');
      if (enhanced != null) {
        console.log('Enhanced Content ==>', enhanced.join('|'));
        addElementToDocument('enhanced_added', enhanced.join(' '));
      }


      const aplusImgs = getAllXpath("//div[@class='ccs-cc-inline-feature']//img/@src",'value');
      if (aplusImgs != null) {
        console.log('Aplus Images ==>' + aplusImgs);
        addElementToDocument('aplus_added', aplusImgs.join(' | '));
      }

      const availabilityadded = getAllXpath("//span[@id='productAvailability']/text()",'nodeValue');
      
      if(availabilityadded[0] == 'In Stock'  || availabilityadded[0] == 'Pre-Order' || availabilityadded[0] == 'Limited Quantity Available' || availabilityadded[0] == 'Temporarily Out-of-Stock'){
        addElementToDocument('stock_status_added', 'In Stock');
      } else {
        addElementToDocument('stock_status_added', 'Out of Stock');
      }
      

      const altImgs = getAllXpath("//div[@class='image-navigation']/ul[@id='thumbList']/li[position()>1]/a//img/@src",'nodeValue'); 
      if(altImgs.length > 0){
        console.log('Alternate Images ==>',altImgs.join(' || '));
        addElementToDocument('altimgs_added',altImgs.join(' || '));
      }  

    const secondaryImgLength = getAllXpath("//ul[@id='thumbList']/li[position()>1]/a//img/@src", 'nodeValue'); 
    if(secondaryImgLength){
      addElementToDocument('secondary_imgcount_added',secondaryImgLength.length);
    }

    const warranty = getAllXpath("//div[@class='panel-body']/ul/li[contains(*,'Warranty')]/div", 'innerText');
    if(warranty != null){
      console.log("warranty Information ==>",warranty);
      addElementToDocument('warranty_added',warranty);
    }
    });
    await context.extract(productDetails, { transform: transformParam });
  },

};
