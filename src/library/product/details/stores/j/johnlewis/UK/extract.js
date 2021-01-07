const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform,
    domain: 'johnlewis.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    try {
      await context.waitForSelector('button[data-test="allow-all"]');
      await context.click('button[data-test="allow-all"]');
    } catch (e) {
      console.log('No cookies box');
    }

    try {
      await context.waitForSelector('section[data-test="product-card"] img');
      await context.click('h2[class*=title_title]');
      const a = await context.evaluate(() => {
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

      const bindPipesToTheList = (xpath) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) {
            nodeSet.snapshotItem(index).textContent = `|| ${nodeSet.snapshotItem(index).textContent}`;
          }
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

      bindPipesToTheList("//div[@class='product-detail__description-inner']/ul/li");

      var image = getAllXpath("//ul[@class='thumbnail-wrapper']/li[position()>1]/img/@src", 'nodeValue');
      if (image != null) {
        for (var i = 0; i < image.length; i++) {
          image[i] = 'https:' + image[i];
        }
        var qqq = image.join(' | ');
        addElementToDocument('img', qqq);
      }

      var specification = getAllXpath("//dl[@class='product-specifications-list']/dt/text()", 'nodeValue');
      var aaa = [];
      if (specification != null) {
        for (var i = 0; i < specification.length; i++) {
          if (specification[i].length != 150) {
            aaa.push(specification[i].trim());
          }
        }
        var bbb = getAllXpath("//dl[@class='product-specifications-list']/dd/text()", 'nodeValue');
        var final = '';
        for (var i = 0; i < aaa.length; i++) {
          console.log('aaa[i]');
          console.log(aaa[i] + 'i');
          final = final + aaa[i].replace(/\s([^\s]*)$/, '') + ' : ' + bbb[i];
          if (aaa[i + 1] !== undefined) {
            final = final + ' || ';
          }
        }
        addElementToDocument('spec', final);
      }

      let inTheBoxData = getAllXpath('//dt[contains(.,"Accessories Included")]/following-sibling::dd[1]/text()|//b[contains(text(), "In the box")]/ancestor::p/following-sibling::ul//li/text()', 'nodeValue');

      if (inTheBoxData != null) {
        for (let i = 0; i < inTheBoxData.length; i++) {
          inTheBoxData[i] = inTheBoxData[i].replace('|| ', '')
          inTheBoxData[i] = inTheBoxData[i].replace(/,/gm, ' || ');
        }
        inTheBoxData = inTheBoxData.join(' || ');
        addElementToDocument('ii_inTheBoxData', inTheBoxData);
      }

      const similarItems = document.querySelectorAll('.recommendations-oos-container jl-recommendations-panel');
      const updpItems = [];

      for (const similarItem of similarItems) {
        const itemsEl = similarItem.shadowRoot.querySelector('[data-test="recommendations-panel"]');
        if (itemsEl) {
          const items = itemsEl.querySelectorAll('.slick-slide');

          for (const el of items) {
            let title = el.querySelector('h2[class*="title_title"]') ? el.querySelector('h2[class*="title_title"]').innerText : null;
            if (title) {
              updpItems.push(title);
            }
          }
        }
      }

      const customerAlsoBoughtItemEls = document.querySelectorAll('.standard-product-column-full jl-recommendations-panel');

      for (const customerAlsoBoughtItemEl of customerAlsoBoughtItemEls) {
        const items = customerAlsoBoughtItemEl.shadowRoot.querySelectorAll('.slick-list h2[class*="title_title"]');

        for (const el of items) {
            if (el.innerText) {
              updpItems.push(el.innerText);
            }
        }
      }

      for (const item of updpItems) {
        const newEl = document.createElement('import-updp');
        newEl.innerText = item;
        document.body.appendChild(newEl);
      }

      try {
        const productId = window.__NEXT_DATA__.props.pageProps.productId;
        document.body.setAttribute('varinatId', productId);
        const brandName = window.__NEXT_DATA__.props.pageProps.currentSku.brandName;
        document.body.setAttribute('brandName', brandName);
      } catch (e) {
        console.log('ID not found');
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
