
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RO',
    store: 'notino',
    transform: null,
    domain: 'notino.ro',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const productId = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // const url = getXpath("//ul[@id='productsList']//li[@class='item']//@href", 'nodeValue');
      const productIdLatest = getXpath("//div[@class='search-box__inputs']//input[@class='search-box__input']//@value", 'nodeValue');
      // const urlLatest = 'https://www.notino.ro' + url;
      console.log('productIdLatestproductIdLatest', productIdLatest);
      
      return productIdLatest;
    });

    console.log('outsideproductIdLatestproductIdLatest@@@@@@@@@', productId);

    const productUrl = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath("//ul[@id='productsList']//li[@class='item']//@href", 'nodeValue');
      // const productId = getXpath("//ul[@id='productsList']//li[@class='item']//@data-product-code", 'nodeValue');
      const urlLatest = 'https://www.notino.ro' + url;
      return urlLatest;
    });
    console.log(productUrl);
    await context.goto(productUrl);

    const url = await context.evaluate(async function () {
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      var url = getAllXpath("//ul[@class='variantsStyled__VariantList-sc-1hj58ih-6 ihUKVz']//a/@href", 'nodeValue').join(',');
      var urlList = url.split(',');

      console.log('my urlurlListurlList', urlList);
      return urlList;
    });

    // await context.evaluate(async function () {
    //   const getXpath = (xpath, prop) => {
    //     const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    //     let result;
    //     if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    //     else result = elem ? elem.singleNodeValue : '';
    //     return result && result.trim ? result.trim() : result;
    //   };
    //   // url.forEach(element => {
    //   });
    // url.forEach(element => {
    await context.goto('https://www.notino.ro' + url[1], { timeout: 50000, waitUntil: 'load', checkBlocked: true, captureRequests: true });
    
    await context.evaluate(async function () {
      console.log('After GOto and After evalute', productId);
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const variantId = getXpath("//span[@class='styled__CodeBlock-mu8uqe-1 fuzqBd']", 'innerText');
      console.log('my variant', variantId);
      var variantIdInfo = variantId;
      var myVarint = variantIdInfo.substring(5, 15);
      console.log('Before my RPCCCCCCCCCCCCCCCC', myVarint);
      console.log('Before my productIdproductIdproductIdproductIdproductId', productId);
      // const productId = getXpath("//ul[@id='productsList']//li[@class='item']//@data-product-code", 'nodeValue');
      if (myVarint === productId) {
        // console.log('my RPCCCCCCCCCCCCCCCC', rpc);
        console.log('my productIdproductIdproductIdproductIdproductId', productId);
        await context.goto(url);
      }
    });


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

      const secondaryImages = getXpath("//script[@type='application/ld+json']", 'innerText');
      if (secondaryImages && typeof secondaryImages === 'string') {
        var secondaryImagesObj = JSON.parse(secondaryImages);
        var obj = secondaryImagesObj.image;

        for (var simg = 1; simg < obj.length; simg++) {
          if (simg !== 0) {
            addElementToDocument('added_images', obj[simg]);
          }
          addElementToDocument('added_manufacture_images', obj[simg]);
        }
      }

      // const variantId = getXpath("//span[@class='styled__CodeBlock-mu8uqe-1 fuzqBd']", 'nodeValue');
      // var variantIdInfo = variantId;
      // var finalId = variantIdInfo.subString(5, 12);
      // console.log('my variant', finalId);
      // // script[@id='__APOLLO_STATE__']

      // span[@class='styled__CodeBlock-mu8uqe-1 fuzqBd']//span
      const variantId = getXpath("//span[@class='styled__CodeBlock-mu8uqe-1 fuzqBd']", 'innerText');
      console.log('my variant', variantId);
      var variantIdInfo = variantId;
      var myVarint = variantIdInfo.substring(5, 15);
      addElementToDocument('variantId', myVarint);



      const variantInformation = getXpath("//script[@id='__APOLLO_STATE__' and @type='application/json']", 'innerText');
      if (variantInformation && typeof variantInformation === 'string') {
        console.log('variantInformationObjFirst', variantInformation);
        var variantInformationObj = JSON.parse(variantInformation);
        console.log('variantInformationObj', variantInformationObj.Variant);
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

    await context.extract(productDetails);
  },
};
