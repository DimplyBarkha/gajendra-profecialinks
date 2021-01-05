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
    helperModule: 'module:helpers/helpers',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, dependencies) => {
    const { helperModule: { Helpers } } = dependencies;
    const helper = new Helpers(context);
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
    // scroll to bottom of page, iframe should load if present!
    await context.evaluate(async () => {
      await window.scrollTo(0, document.body.scrollHeight);
    });
    const getAplusContent = async (aplusSelector, isIframe) => context
      .waitForSelector(aplusSelector, { timeout: 10000 })
      .then(async () => {
        console.log(`Attempting to collect Aplus on the following selector: ${aplusSelector}`);
        if (!isIframe) return null;
        // scroll to bottom of page, iframe should load if present!
        await context.evaluate(async () => {
          await window.scrollTo(0, document.body.scrollHeight);
        });
        // scroll to iframe
        await context.evaluate((selector) => {
          const marketingIframe = document.querySelector(selector);
          if (marketingIframe) marketingIframe.scrollIntoView();
        }, aplusSelector);
        // wait for iframe to load
        await helper.waitForInDifferentContext('body > div', aplusSelector, 30000);
        await helper.waitForFrameToLoad(aplusSelector, 10000);
        await new Promise(resolve => setTimeout(resolve, 3000));
      })
      .then(async () => context.evaluate(async (selector) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const getShadowRoots = (elem, resArr = []) => {
          if (elem.shadowRoot) return [...resArr, elem.shadowRoot];
          return [...elem.childNodes]
            .reduce((acc, elC) => [...acc, ...resArr, ...getShadowRoots(elC, resArr)], resArr);
        };

        const marketingIframe = document.querySelector(selector);
        if (marketingIframe) {
          const roots = [...getShadowRoots(marketingIframe.contentDocument || marketingIframe), marketingIframe.contentDocument]
            .filter(u => u);
          const imagesSrc = [...roots.reduce((acc, doc) => [...acc, ...doc.querySelectorAll('img')], [])]
            .map(img => {
              const src = img.getAttribute('src');
              return !src.startsWith('http') ? `https:${src}` : src;
            });
          addHiddenDiv('my_manufact_images', imagesSrc.join(' | '));

          let setText;
          const syndigoRoots = roots.filter(root => root.querySelector('.syndi_powerpage'));
          if (syndigoRoots.length > 0) {
            const selSyndigo = 'h1, h2, .syndigo-featureset-feature-caption, .syndigo-featureset-feature-description';
            // @ts-ignore
            setText = [...syndigoRoots.reduce((acc, doc) => [...acc, ...doc.querySelectorAll(selSyndigo)], [])]
              .map(el => el.innerText ? el.innerText : '\n');
          } else {
            // @ts-ignore
            setText = [...new Set(
              [...roots.reduce((acc, doc) => [...acc, ...doc.querySelectorAll('div')], [])]
                .map(el => el.innerText),
            )];
          }

          addHiddenDiv('my_enh_content', setText.join(' '));
          const witb = Array.from(document.querySelectorAll('[data-section-caption="In the box"] .wc-aplus-body ul > li img[title]')).map(img => ({img: img.src, title: img.title}));
          const witbText = witb.map(elm => elm.title).join('|');
          const witbUrl = witb.map(elm => elm.img).join('|');
          witbText.length && addHiddenDiv('witb_text', witbText);
          witbUrl.length && addHiddenDiv('witb_url', witbUrl);
          return true;
        }

        console.error(`Selector is not there: ${aplusSelector}`);
        return false;
      }, aplusSelector))
      .catch((e) => {
        console.error(e);
        console.log(`no aplus iframe on selector: ${aplusSelector}`);
        return false;
      });
    ;
    // Iframe logic for aplus_images & enhanced_content if not picked up in API:
    const enhancedContentSelector = 'iframe#iframe-AboutThisItem-marketingContent';
    const gotEnhancedContent = await getAplusContent(enhancedContentSelector, true);

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
            const witb = Array.from(marketingDiv.querySelectorAll('[data-section-caption="In the box"] .wc-aplus-body ul > li img[title]')).map(img => ({img: img.src, title: img.title}));
            const witbText = witb.map(elm => elm.title).join('|');
            const witbUrl = witb.map(elm => elm.img).join('|');
            witbText.length && addHiddenDiv('witb_text', witbText);
            witbUrl.length && addHiddenDiv('witb_url', witbUrl);
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
    });
    if (!gotEnhancedContent) await getAplusContent('#added-marketing');
    await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
  },
};
