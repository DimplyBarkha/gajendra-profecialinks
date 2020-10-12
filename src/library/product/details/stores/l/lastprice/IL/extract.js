const { cleanup } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'lastprice',
    transform: cleanup,
    domain: 'lastprice.co.il',
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

      const image = getXpath("//meta[@property='og:image']/@content", 'nodeValue');
      console.log('image fetched ' + image);
      addElementToDocument('added_image', image);

      const netWeight = getAllXpath("//div[@class='col-lg-8 col-md-12 col-sm-12 pl-20 pr-20']//p/text()", 'nodeValue');
      netWeight.forEach(element => {
        if (element.includes('משקל') && element.includes(':')) {
          element = element.split(':')[1];
          addElementToDocument('added_netWeight', element);
        }
      });

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 1000) {
          break;
        }
      }

      const description = getAllXpath("//div[@class='shortdec']/p[not(contains(@class,'pt-10 pointer'))]/text()", 'nodeValue').join(' || ');
      console.log('description fetched ' + description);
      addElementToDocument('added_description', description);

      let sku = getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      sku = JSON.parse(sku);
      console.log('sku fetched ' + sku);
      addElementToDocument('added_sku', sku.sku);

      let variantId = getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      variantId = JSON.parse(variantId);
      console.log('variantId fetched ' + variantId);
      addElementToDocument('added_variantId', variantId.productID);

      const manufacturerDescription = getAllXpath("//div[@id='descr']//div[@class='col-lg-8 col-md-12 col-sm-12 pl-20 pr-20']/div/p[not(img)]", 'innerText');
      console.log('manufacturerDescription fetched ' + manufacturerDescription);
      addElementToDocument('added_manufacturerDescription', manufacturerDescription);

      const manufacturerImages = getAllXpath("//div[@id='descr']//div[@class='col-lg-8 col-md-12 col-sm-12 pl-20 pr-20']/div/p//img/@src", 'nodeValue').join('|');
      console.log('manufacturerImages fetched ' + manufacturerImages);
      addElementToDocument('added_manufacturerImages', manufacturerImages);

      let name = getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      name = JSON.parse(name);
      console.log('name fetched ' + name);
      addElementToDocument('added_name', name.name);

      const alternateImages = getAllXpath("//div[@class='ms-thumb-list ms-dir-h']//div[@class='ms-thumb-frame' and position()>2]//img/@src", 'nodeValue').join('|');
      console.log('alternateImages fetched ' + alternateImages);
      addElementToDocument('added_alternateImages', alternateImages);

      const warranty = getXpath("//div[@id='WarrantyText']", 'innerText');
      console.log('warranty fetched ' + warranty);
      addElementToDocument('added_warranty', warranty);

      const productOtherInformation = getAllXpath("//div[@class='item panel panel-default panel-body']//span | //div[@class='item panel panel-default panel-body']//p", 'innerText').join('|');
      console.log('productOtherInformation fetched ' + productOtherInformation);
      addElementToDocument('added_productOtherInformation', productOtherInformation);

      const specifications = getAllXpath("//div[@id='descr']//div[@class='col-lg-8 col-md-12 col-sm-12 pl-20 pr-20']/div/p[not(img)]", 'innerText');
      specifications.forEach(element => {
        if (element.includes('מפרט טכני')) {
          console.log('specifications fetched ' + element);
          addElementToDocument('added_specifications', element);
        }
      });

      const category = getAllXpath("//ol[@class='breadcrumb container']/li[position()>1]/a/text()", 'nodeValue').join(' > ');
      console.log('category fetched ' + category);
      addElementToDocument('added_category', category);

      // document.querySelector('.ms-slide-vpbtn').click();
    });
    await context.extract(productDetails);
  },
};
