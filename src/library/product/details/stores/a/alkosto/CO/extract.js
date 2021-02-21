const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    transform: cleanUp,
    domain: 'alkosto.com',
    zipcode: '',
  },
  implementation: async ({ url, id }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // const productUrl = await context.evaluate(async function () {
    //   const getXpath = (xpath, prop) => {
    //     const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    //     let result;
    //     if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    //     else result = elem ? elem.singleNodeValue : '';
    //     return result && result.trim ? result.trim() : result;
    //   };
    //   const url = getXpath("//div[@id='salesperson_result']//div[contains(@class,'category-products')]//ul//li//div[contains(@class,'amlabel-div')]//a/@href", 'nodeValue');
    //   // const url = getXpath("//div[contains(@class,'category-products')]//ul//li//div[contains(@class,'amlabel-div')]//a/@href", 'nodeValue');
    //   return url;
    // });

    let cookieAcceptBtnSel = '*[class*="accept_button"] *[class*="policy_button"]';
    let cookieAcceptBtnPresent = false;
    try {
      await context.waitForSelector(cookieAcceptBtnSel);
      cookieAcceptBtnPresent = true;
    } catch(err) {
      console.log('got some error while waiting for cookie btn', err.message);
      try {
        await context.waitForSelector(cookieAcceptBtnSel);
        cookieAcceptBtnPresent = true;
      } catch(err) {
        console.log('got some error while waiting for cookie btn', err.message);
      }
    }

    console.log('cookieAcceptBtnPresent', cookieAcceptBtnPresent);

    if(cookieAcceptBtnPresent) {
      try {
        await context.click(cookieAcceptBtnSel);
        console.log('clicked on this cookieAcceptBtnSel', cookieAcceptBtnSel);
      } catch(err) {
        console.log('got some error while clicking on the btn', err.message);
      }
    }

    let landedOnListingPage = false;
    let productListSel = 'ul[class*="products-grid"] li[class*="products-grid-item"]';
    try {
      await context.waitForSelector(productListSel);
      landedOnListingPage = true;
    } catch(err) {
      console.log('got some error while checking if the page is listing page or not', err.message);
    }

    console.log('landedOnListingPage', landedOnListingPage);
    let productUrl = '';
    console.log('inputString', id);
    if(landedOnListingPage) {
      // need to check and get the product url if present
      productUrl = await context.evaluate(async (productListSel, id) => {
        console.log('productListSel', productListSel);
        let imageSel = 'a[class*="product-image"] img';
        let prodNameLinkSel = '*[class*="product-name"] a';
        let prodUrl = '';
        let prodFound = false;
        let allProdElms = document.querySelectorAll(productListSel);
        if(allProdElms && allProdElms.length > 0) {
          console.log('got a total of these many prod on this listing page', allProdElms.length);
          for(let i = 0; i < allProdElms.length; i++) {
            let imageElm = allProdElms[i].querySelector(imageSel);
            let imageSrcText = '';
            if(imageElm && imageElm.hasAttribute('src')) {
              imageSrcText = imageElm.getAttribute('src');
            }
            if(imageSrcText.includes(id)) {
              prodFound = true;
              let urlElm = allProdElms[i].querySelector(prodNameLinkSel);
              if(urlElm && urlElm.hasAttribute('href')) {
                prodUrl = urlElm.getAttribute('href');
              }
              break;
            }
          }
        }
        console.log('prodFound', prodFound);
        return prodUrl;

      }, productListSel, id);
    }
    
    console.log(productUrl);
    try {
      await context.goto(productUrl);
    } catch (error) {
      console.log('No record');
    }
    async function loadResources () {
      await context.setAntiFingerprint(false);
      await context.setLoadAllResources(true);
      await context.setBlockAds(false);
    }
    await loadResources();
    try {
      await context.waitForSelector('div[id="std-description"] img', {}, { timeout: 50000 });
    } catch (error) {
      console.log(error);
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
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
      const aggregateRatingXpath = getXpath("//script[@class='y-rich-snippet-script']", 'innerText');
      try {
        if (aggregateRatingXpath && typeof aggregateRatingXpath === 'string') {
          var aggregateRatingObj = JSON.parse(aggregateRatingXpath);
          // console.log(parseFloat(aggregateRatingObj.aggregateRating.ratingValue));
          addElementToDocument('added_aggregate', aggregateRatingObj.aggregateRating.ratingValue.replace(/\./g, ','));
        }
      } catch (error) {
        const aggregateRatingXpath2 = getXpath('//div[@class="yotpo-display-wrapper" and @aria-hidden="true"]//a/@aria-label', 'nodeValue');
        if (aggregateRatingXpath2) {
          addElementToDocument('added_aggregate', aggregateRatingXpath2.substring(0, aggregateRatingXpath2.indexOf(' ')).replace(/\./g, ','));
        }
      }
      const aggregateRatingCountXpath = getXpath("//div[@class='yotpo-display-wrapper' and @aria-hidden='true']//a", 'innerText');
      if (aggregateRatingCountXpath) {
        var patt = /[0-9]+/g;
        if (patt.test(aggregateRatingCountXpath)) {
          addElementToDocument('added_ratingCount', aggregateRatingCountXpath);
        } else {
          addElementToDocument('added_ratingCount', 0);
        }
      }
      const specificationsXpath = "//table[@id='product-attribute-specs-table']//tbody//tr";
      var specificationsStr = getAllXpath(specificationsXpath, 'innerText').join('');
      addElementToDocument('added_specifications', specificationsStr);

      const listPrice = "//div[@class='product-main-info']//span[@class='price-old']";
      var listPricePath = getXpath(listPrice, 'innerText');
      if (listPricePath !== null) {
        // addElementToDocument('added_listPrice', listPricePath.replace(/\D/g, '').replace(/(\d{3})$/g, ',$1'));
        addElementToDocument('added_listPrice', listPricePath.replace(/\./g, ''));
      }
      // const price = "//div[@class='product-main-info']//p[@class='special-price']//span[contains(@id,'product-price')]";
      const price = "//div[@class='product-main-info']//p[@class='special-price']//span[contains(@id,'product-price')] | //div[@class='product-main-info']//div[@class='price-box']//span[@class='regular-price']";
      var pricePath = getXpath(price, 'innerText');
      if (pricePath !== null) {
        // addElementToDocument('added_price', pricePath.replace(/\D/g, '').replace(/(\d{3})$/g, ',$1'));
        addElementToDocument('added_price', pricePath.replace(/\./g, ''));
      }
    });
    // }
    await context.extract(productDetails, { transform: transformParam });
  },
};
