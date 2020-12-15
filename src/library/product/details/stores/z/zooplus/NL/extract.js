const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'zooplus',
    transform: cleanUp,
    domain: 'zooplus.nl',
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
        addElementToDocument('addedImage', imgSrc);

        const imageAlt = getXpath("//div[contains(@class,'media__gallery')]//div[@id='js-first_image_loading']//img/@alt", 'nodeValue');
        addElementToDocument('addedImageAlt', imageAlt);

        const ingrediantsNode = getAllXpath('//div[@id="ingredients-panel"]//p[not(@id="product__analytics")]//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//b/text()[not(contains(.,"Analytische bestandsdelen")) and normalize-space(.)] | //div[@id="ingredients-panel"]//i//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//a//text()[normalize-space(.)] | //div[@id="ingredients-panel"]//article/text()[normalize-space(.)]', 'nodeValue');
        addElementToDocument('addedIngrediants', ingrediantsNode.join(''));

        const directionNode = getAllXpath('//div[@id="feedingrecommendation-panel"]//text()[normalize-space(.)]', 'nodeValue');
        addElementToDocument('addedDirection', directionNode.join(''));

        // const listPriceNodes = getAllXpath("//div[contains(@class,'product__prices_col')]//span[@class='product__smallprice__text'][1]/text()", 'nodeValue');
        // if (listPriceNodes != null) {
        //   var listPrice = [];
        //   listPriceNodes.forEach(element => {
        //     listPrice.push(element.match(/€\s.+/g));
        //   });
        // }

        const gtin = getAllXpath('//div[contains(@class,"product__variants")]//div[@data-variant-id]//meta[@itemprop="gtin13"]/@content', 'nodeValue');

        const variantNodeInfo = document.querySelector('#productDataLayer').innerText;
        const variantObject = JSON.parse(variantNodeInfo);
        const variants = variantObject.variants;
        const sku = variantObject.product;
        const targetElement = document.querySelector('body');
        const newUl = document.createElement('ul');
        newUl.id = 'variantsadd';
        targetElement.appendChild(newUl);

        const ul = document.querySelector('#variantsadd');

        function variantInformation (item) {
          var variantInformation = [];
          for (let i = 0; i < variants.length; i++) {
            if (!(variants[i].variant_id === item.variant_id)) {
              variantInformation.push(variants[i].variant_id);
            }
          }
          return variantInformation.join(' | ');
        }
        try {
          if (variants.length) {
            for (let i = 0; i < variants.length; i++) {
              const listItem = document.createElement('li');
              setAttributes(listItem, {
                variant_name: sku.product_name,
                sku: sku.product_id,
                brand: sku.brand,
                aggregarerating: sku.average_prod_review,
                reviewcount: sku.amount_prod_reviews,
                gtin: gtin[i],
                retailer_product_code: variants[i].variant_id,
                variant_price: variants[i].variant_price,
                stock: variants[i].out_stock === false ? 'In Stock' : 'Out of Stock',
                varianttitle: variants.length > 1 ? variants[i].variant_name : '',
                variantdetails: variantInformation(variants[i]),
                variantcount: variants.length > 1 ? (variants.length - 1) : 0,
                firstVariant: variants.length > 1 ? variants[0].variant_id : '',
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
        const url = 'https://www.zooplus.nl' + prodInfo.url;
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
          skuElement.id = 'addedSku';
          skuElement.textContent = invalidProductId;
          skuElement.style.display = 'none';
          document.querySelector('section.searchResult').appendChild(skuElement);
          const pageUrl = document.createElement('div');
          pageUrl.id = 'addedProductUrl';
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
