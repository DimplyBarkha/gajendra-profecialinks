const { transform } = require('./transform');

/*
*  @param { { url?: string,  id?: string, parentInput?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform,
    domain: 'walmart.com',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, dependencies) => {
    await context.addToDom('added-parentInput', parentInput);

    async function addAdditionalContent () {
      await context.evaluate(async () => {
        async function getSellerInformation (url) {
          try {
            var data = await
            fetch(url)
              .then(response => response.text())
              .catch();
            return (data);
          } catch (error) {
            console.log(error);
            throw (error);
          }
        }
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
          return newDiv;
        }
        const node = document.querySelector("script[id='item']");
        if (node && node.textContent) {
          const jsonObj = node.textContent.startsWith('{"item":') ? JSON.parse(node.textContent) : null;
          if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox && jsonObj.item.product.buyBox.products &&
              jsonObj.item.product.buyBox.products[0]) {
            const content = jsonObj.item.product.buyBox.products[0];
            if (content.idmlSections && content.idmlSections.marketingContent) {
              const marketingDiv = addHiddenDiv('added-marketing', '');
              marketingDiv.innerHTML = unescape(jsonObj.item.product.buyBox.products[0].idmlSections.marketingContent);
            }
            if (content.shippingOptions && content.shippingOptions[0] && content.shippingOptions[0].fulfillmentPrice) {
              let price = '0';
              if (content.freeShippingThresholdPrice && content.freeShippingThresholdPrice.price) {
                price = '0';
              } else {
                price = content.shippingOptions[0].fulfillmentPrice.price;
              }
              addHiddenDiv('added-sprice', price);
            }
          }
        }
        const url = window.location.href;
        const id = url.replace(/[^\d]/g, '');
        addHiddenDiv('added-sku', id);
        const sellerUrl = `https://www.walmart.com/product/${id}/sellers`;
        const result = await getSellerInformation(sellerUrl);
        const sellerDiv = addHiddenDiv('added-sellers', '');
        sellerDiv.innerHTML = result;
      });
    };

    await context.waitForXPath("//meta[@property='og:image']/@content", { timeout: 5000 })
      .catch(() => console.log('no product image available'));

    await context.waitForXPath("//p[@class='Directions']", { timeout: 6000 })
      .catch(() => console.log('no directions present'));

    await context.waitForXPath('(//div[contains(@class,"prod-alt-image")]/img/@src)[position()!=1]', { timeout: 6000 })
      .catch(() => console.log('no alt Images'));

    await context.click('body');

    const nutrTabPresentAndClicked = await context.evaluate(async () => {
      const nutrTab = document.evaluate('//span[contains(text(),"Nutrition Facts")]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      if (nutrTab) {
        nutrTab.click();
      }
      return !!nutrTab;
    });
    if (nutrTabPresentAndClicked) {
      await context.waitForSelector('.nutrition-facts-title', { timeout: 4000 })
        .then(async () => {
          await context.evaluate(() => {
            function addHiddenDiv (id, content) {
              const newDiv = document.createElement('div');
              newDiv.id = id;
              newDiv.textContent = content;
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }
            const carbs = document.evaluate('(//span[contains(text(),"Total Carbohydrate")]/following-sibling::span)[position()=1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
            console.log(`carbs:${carbs}`);
            addHiddenDiv('my-carbs', carbs);
          });
        })
        .catch(() => console.log('n/a'));

      await context.click('ul.persistent-subnav-list li[data-automation-id=tab-item-0]', { timeout: 3000 })
        .catch(() => console.log('no specTab'));
    }

    // Iframe logic for aplus_images & enhanced_content if not picked up in API:
    await context.evaluate(async () => {
      // scroll to bottom of page, iframe should load if present!
      await window.scrollTo(0, document.body.scrollHeight);
    });
    await context.waitForSelector('iframe#iframe-AboutThisItem-marketingContent', { timeout: 5000 })
      .then(async () => {
        await context.evaluate(async () => {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }

          const marketingIframe = document.querySelector('iframe#iframe-AboutThisItem-marketingContent');
          if (marketingIframe) {
            marketingIframe.scrollIntoView();
            await new Promise((resolve, reject) => setTimeout(resolve, 5000));
            const images = marketingIframe.contentDocument.querySelectorAll('img');
            const imagesSrc = [];
            images.forEach(img => {
              let imgUrl = img.getAttribute('src');
              if (!imgUrl.startsWith('http')) {
                imgUrl = 'https:' + imgUrl;
              }
              imagesSrc.push(imgUrl);
            });
            addHiddenDiv('my_manufact_images', imagesSrc.join(' | '));

            const enhancedContent = marketingIframe.contentDocument.querySelectorAll('div');
            if (enhancedContent) {
              const setText = new Set();
              Array.from(enhancedContent).forEach((el) => setText.add(el.innerText));
              addHiddenDiv('my_enh_content', Array.from(setText).join(' '));
            }
          }
        });
      })
      .catch(() => console.log('no aplus iframe'));

    await addAdditionalContent();
    await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
  },
};
