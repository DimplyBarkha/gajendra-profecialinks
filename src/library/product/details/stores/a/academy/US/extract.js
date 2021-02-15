const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'academy',
    transform: cleanUp,
    domain: 'academy.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    // await context.waitForXPath("//div[@class='bv-control-bar-count']//span[@role='status']");
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
      // const ratingNode = getXpath("//div[@class='bv-control-bar-count']//span[@role='status']", 'innerText');
      // console.log(ratingNode);
      // if (ratingNode !== null) {
      //   var ratingResult = ratingNode.split(' ');
      //   console.log(ratingResult);
      //   var ratingCount = ratingResult[ratingResult.length - 2];
      //   console.log(ratingCount);
      //   addElementToDocument('added_ratingcount', ratingCount);
      // }
      // const category = getAllXpath("//div[@data-auid='breadcrumb']//ol//text()", 'nodeValue');
      // console.log('category   ' + category);
      // addElementToDocument('added_category', category);
      const description = getAllXpath("//div[@class='product-details-content']//div[@class='']", 'innerText');
      console.log('description' + description);
      addElementToDocument('added_description', description);

      // const addtionalDescBullets = getAllXpath("//div[@class='product-details-content']//div[@class='']//li", 'innerText');
      // if (addtionalDescBullets) {
      //   var additionalDescBulletText = addtionalDescBullets.join('|| ');
      //   addElementToDocument('addedAdditionaDescBullets', additionalDescBulletText);
      // }
      // const addtionalDesc = getAllXpath("//div[@class='product-details-content']//div[@class='css-nx0jru']//text()", 'nodeValue');
      // var finalText = (additionalDescBulletText !== '') ? (addtionalDesc + ' | ' + additionalDescBulletText) : addtionalDesc;
      // addElementToDocument('added_description', finalText);
      // const alternateImages = getAllXpath("//div[@id='offer-bg']//div[@id='offerImges']/div[position()>1]/img/@src", 'nodeValue').join(' | ');
      // console.log('alternateImages   ' + alternateImages);
      // addElementToDocument('added_alternateImages', alternateImages);

      const featureBullets = getAllXpath("//div[@class='product-details-content']//div[@class='']//li", 'innerText');
      if (featureBullets) {
        var additionalDescBulletText = featureBullets.join('|| ');
        addElementToDocument('addedAdditionaDescBullets', additionalDescBulletText);
      }
      const addtionalDesc = getAllXpath("//div[@aria-label='Product_Detail_Content']//div[@data-auid='feature-benefits']//li", 'nodeValue');
      var finalText = (additionalDescBulletText !== '') ? (addtionalDesc + ' | ' + additionalDescBulletText) : addtionalDesc;
      addElementToDocument('added_featureBullets', finalText);

      // const variantId = getXpath("//meta[@property='og:url']", 'content');
      // const variantIdValue = variantId.split("/")[4]
      // addElementToDocument('added_variantId', variantIdValue);

      // const color = getXpath("//div[@class='d-flex css-aw3xrg']", 'content');
      // const colorValue = color.split(":")[1]
      // addElementToDocument('added_color', colorValue);
      // let listPrice = getXpath("//div[@id='DealValueWrap']", 'innerText');
      // console.log('listPrice ', listPrice);
      // let listPriceValue;
      // if(listPrice != null){
      //   listPrice =  listPrice.replace(/\r\n|\r|\n/g, ' ');
      //   listPriceValue = listPrice.split(" ")[1]+listPrice.split(" ")[0]
      // }

      // addElementToDocument('added_listPrice', listPriceValue);

      // const price = getXpath("//div[@class='deal-price']//div[@style='float:right;']", 'innerText').replace(/\r\n|\r|\n/g, ' ');
      // const priceValue = price.split(" ")[1]+price.split(" ")[0]
      // addElementToDocument('added_price', priceValue);

      const specifications = getAllXpath("//div[@data-auid='specifications']//div[@role='list']", 'innerText');
      addElementToDocument('added_specifications', specifications);

      let netWeight = getXpath("//div[@role='list']//li[@data-auid='specifications_listing'][contains(.,'weight')]//text()", 'nodeValue');
      if (netWeight != null && netWeight.includes(':')) {
        netWeight = netWeight.split(':')[1];
      } else if (netWeight != null && netWeight.includes('-')) {
        netWeight = netWeight.split('-')[1];
      } else if (netWeight != null && netWeight.includes('weight')) {
        netWeight = netWeight.replace('weight', '');
      }
      addElementToDocument('added_netWeight', netWeight);

      let netSize = getXpath("//header[@data-auid='PDP_Size_heading']//div[@class='d-flex css-aw3xrg'] | //header[@data-auid='PDP_Shoe Size_heading']//div[@class='d-flex css-aw3xrg']", 'innerText');
      if (netSize != null) {
        netSize = netSize.split(':')[1];
      }
      addElementToDocument('added_netSize', netSize);
      let packSize = getXpath("//div[@role='list']//li[@data-auid='specifications_listing']//text()[contains(.,'Pack size')]", 'nodeValue');
      if (packSize != null) {
        packSize = packSize.split(':')[1];
      }
      addElementToDocument('added_packSize', packSize);
      // } else if (packSize != null && packSize.includes('-')) {
      //   packSize = packSize.split('-')[1];
      // } else if (packSize != null && packSize.includes('packSize')) {
      //   packSize = packSize.replace('packSize', '');
      // }
      let warranty = getXpath("//div[@role='list']//li[@data-auid='specifications_listing'][contains(.,'Manufacturer warranty')]//text()", 'nodeValue');
      if (warranty != null && warranty.includes(':')) {
        warranty = warranty.split(':')[1];
      } else if (warranty != null && warranty.includes('-')) {
        warranty = warranty.split('-')[1];
      } else if (warranty != null && warranty.includes('warranty')) {
        warranty = warranty.replace('warranty', '');
      }
      addElementToDocument('added_warranty', warranty);

      let availabilityText = getXpath("//div[@data-auid='PDP_DeliveryInfo_ShipToHome']//div[@class='css-1flyvhq']//span[2]", 'innerText');
      console.log('Availabity Text', availabilityText);
      if (availabilityText !== null && availabilityText === 'SHIPPING AVAILABLE') {
        availabilityText = 'In store only';
        console.log('Availabity Text if shipping available', availabilityText);
      } else {
        availabilityText = 'In Stock';
        console.log('Availabity Text if shipping not available', availabilityText);
      }
      addElementToDocument('added_availabilityText', availabilityText);

      // addElementToDocument('added_packSize', packSize);

      let technicalDoc = getXpath("//div[@role='list']//a//@href", 'nodeValue');
      if (technicalDoc != null && technicalDoc.includes('https')) {
        technicalDoc = 'Yes';
      } else {
        technicalDoc = 'No';
      }
      addElementToDocument('added_technicalDoc', technicalDoc);

      addElementToDocument('added_variantCount', 0);
      if (document.querySelector('li.PDP_REVIEWS')) {
        // @ts-ignore
        document.querySelector('li.PDP_REVIEWS').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 1000));
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
      const ratingCount1 = getXpath('//div[@class="bv-control-bar"]//div[@class="bv-control-bar-count"]//span', 'innerText');
      if (ratingCount1) {
        const ratingArray = ratingCount1.split(' ');
        const ratingVal = ratingArray[2];
        addElementToDocument('added_ratingCount1', ratingVal);
      }
    });
    // await context.evaluate(async () => {
    //   if (document.querySelector('li.PDP_REVIEWS')) {
    //     // @ts-ignore
    //     document.querySelector('li.PDP_REVIEWS').click();
    //     // eslint-disable-next-line promise/param-names
    //     await new Promise(r => setTimeout(r, 1000));
    //   }
    // });

    await context.extract(productDetails);
  },
};
