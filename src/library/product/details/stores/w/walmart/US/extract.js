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
  implementation: async ({ parentInput }, { country, domain, transform }, context, dependencies) => {
    await context.addToDom('added-parentInput', parentInput);

    await context.click('//span[@class="button-wrapper" and contains(text(),"Show delivery")]')
      .catch(() => console.log('No other pickup/delivery options'));

    await context.waitForXPath("//meta[@property='og:image']/@content", { timeout: 5000 })
      .catch(() => console.log('no product image available'));

    await context.waitForXPath("//p[@class='Directions']", { timeout: 6000 })
      .catch(() => console.log('no directions present'));

    await context.waitForXPath('(//div[contains(@class,"prod-alt-image")]/img/@src)[position()!=1]', { timeout: 6000 })
      .catch(() => console.log('no alt Images'));

    const nutrTabPresentAndClicked = await context.evaluate(async () => {
      const nutrTab = document.evaluate('//span[contains(text(),"Nutrition Facts")]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      if (nutrTab) {
        // @ts-ignore
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
      // await window.scrollTo(0, document.body.scrollHeight);
    });
    const enhancedContentSelector = 'iframe#iframe-AboutThisItem-marketingContent';
    await context.waitForSelector(enhancedContentSelector, { timeout: 5000 })
      .catch(() => console.log('no aplus iframe'));
    await context.evaluate(async (selector) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const marketingIframe = document.querySelector(selector);
      if (marketingIframe) {
        marketingIframe.scrollIntoView();
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        const imagesSrc = [...marketingIframe.contentDocument.querySelectorAll('img')]
          .map(img => {
            const src = img.getAttribute('src');
            return !src.startsWith('http') ? `https:${src}` : src;
          });
        addHiddenDiv('my_manufact_images', imagesSrc.join(' | '));

        // @ts-ignore
        const setText = [...new Set(
          [...marketingIframe.contentDocument.querySelectorAll('div')].map(el => el.innerText),
        )];
        addHiddenDiv('my_enh_content', setText.join(' '));

        // In the box contents
        const inTheBox = Array.from(new Set(
          [...marketingIframe.contentDocument.querySelectorAll('[data-section-tag="in-the-box"] ul > li h3')].map(el => el.innerText),
        ));
        addHiddenDiv('in_the_box', inTheBox.join('|'));

        // In the box contents
        const nutritionImage = marketingIframe.contentDocument.querySelector('[data-section-caption="Nutrition Facts"] img');
        if (nutritionImage) {
          addHiddenDiv('nutrition-image', nutritionImage.getAttribute('src'));
        }
      }
    }, enhancedContentSelector);

    // add additionall content
    await context.evaluate(async () => {
      async function getSellerInformation (url) {
        var data = await fetch(url)
          .then(response => response.text())
          .catch(console.log);
        return (data);
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
      const id = window.location.pathname.split('/').filter(wd => wd).slice(-1)[0];
      addHiddenDiv('added-sku', id);
      const sellerUrl = `https://www.walmart.com/product/${id}/sellers`;
      const result = await getSellerInformation(sellerUrl);
      const sellerDiv = addHiddenDiv('added-sellers', '');
      // @ts-ignore
      sellerDiv.innerHTML = result;

      // variant info
      if (document.querySelector('#item')) {
        const json = JSON.parse(document.querySelector('#item').innerText);
        const variants = json.item.product.buyBox.criteria.map(elm => elm.values.map(a => a.title)).flat().join('|');

        addHiddenDiv('variants-info', variants);
      }
    });
    return await context.extract(dependencies.productDetails, { transform });
  },
};
