const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform: cleanUp,
    domain: 'johnlewis.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    try {
      await context.waitForSelector('button[data-test="allow-all"]');
      await context.click('button[data-test="allow-all"]');
    } catch(e) {
      console.log('No cookies box')
    }

    try {
      await context.waitForSelector('section[data-test="product-card"] img');
      await context.click('h2[class*=title_title]');
      let a = await context.evaluate(()=>{
        return (document.querySelector('section[data-test="product-card"] a').getAttribute('href'));
      });
      console.log(a);
      await context.waitForNavigation();
      await context.waitForSelector('.product-page img');
    } catch (err) {
      console.log('No result found');
    }

    async function scrollToRec (node) {
      await context.evaluate(async function (node) {
        var element = (document.querySelector(node)) ? document.querySelector(node) : null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 3000);
          });
        }
      }, node);
    }
    await scrollToRec('div.footer-links');
    await scrollToRec('section.product-breadcrumb-carousel');
    await scrollToRec('div.product-breadcrumb-carousel__container');
    await scrollToRec('div[class^="recommendationsPanel"]');
    await scrollToRec('jl-recommendations-panel');

    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
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
      const recommendProductsMain = document.querySelectorAll('jl-recommendations-panel');

      recommendProductsMain.forEach(element => {
        const recommenProducts = element ? [...element.shadowRoot.querySelectorAll('section[data-test="product-card"] h2[class^="title"]')] : [];
        recommenProducts.forEach(element => {
          addElementToDocument('ii_recommended_products', element.innerText);
        });
      });

      var Description = getAllXpath("//div[@class='product-detail__description-inner']/p[position()>1]/text()", 'nodeValue');
      if (Description != null) {
        var ppp = Description.join(" || ")
        addElementToDocument('desc', ppp);
      }

      var image = getAllXpath("//ul[@class='thumbnail-wrapper']/li[position()>1]/img/@src", 'nodeValue');
      if (image != null) {
        for (var i=0; i < image.length; i++){
          image[i] = "https:" + image[i]
        }
        var qqq = image.join(" | ")
        addElementToDocument('img', qqq);
      }

      var specification = getAllXpath("//dl[@class='product-specifications-list']/dt/text()", 'nodeValue');
      var aaa = []
      if (specification != null) {
        for (var i = 0; i < specification.length; i++) {
          if (specification[i].length != 150) {
            aaa.push(specification[i].trim());
          }
        }
        var bbb = getAllXpath("//dl[@class='product-specifications-list']/dd/text()", 'nodeValue');
        var final = ""
        for (var i = 0; i < aaa.length; i++) {
          console.log('aaa[i]')
          console.log(aaa[i] + 'i')
          final = final + aaa[i].replace(/\s([^\s]*)$/, '') + ': ' + bbb[i];
          if (aaa[i + 1] != undefined) {
            final = final + " || "
          }
        }
        addElementToDocument('spec', final);
      }



      var xyz = getXpath("//div[@class='star-ratings']/div[@class='stars-empty']/@style", 'nodeValue');
      if (xyz != null) {
        var abc = xyz.split(": ")[1]
        var width = abc.slice(0, -2);
        width = (width * 5) / 100;
        addElementToDocument('star', width);
      }

      var rrr = getXpath("//p[@class='u-centred']/text() | //h2[@class='email-me-stock__header']/text()", 'nodeValue');
      if (rrr != null) {
        if (rrr.includes("in stock")) {
          rrr="In Stock";
        } else {
          rrr="Out of Stock";
        }
        addElementToDocument('stock', rrr);
      }

      const inTheBoxData = getAllXpath('//dt[contains(.,"Accessories Included")]/following-sibling::dd[1]/text()|//b[contains(text(), "In the box")]/ancestor::p/following-sibling::ul//li/text()', 'nodeValue');

      if (inTheBoxData != null) {
        for (let i = 0; i < inTheBoxData.length; i++) {
          inTheBoxData[i] = inTheBoxData[i].replace(/,/gm, ' || ');
        }
        addElementToDocument('ii_inTheBoxData', inTheBoxData.join(' || '));
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};