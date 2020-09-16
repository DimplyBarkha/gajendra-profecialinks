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
    transform: transform,
    domain: 'walmart.com',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, dependencies) => {
    async function addAdditionalContent () {
      await context.evaluate(async function (parentInput) {
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
        addHiddenDiv('added-parentInput', parentInput);
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
        const splits = url ? url.split('?')[0].split('/') : [];
        const id = (splits.length > 1) ? splits[splits.length - 2] : '';
        addHiddenDiv('added-sku', id);
        const sellerUrl = `https://www.walmart.com/product/${id}/sellers`;
        const result = await getSellerInformation(sellerUrl);
        const sellerDiv = addHiddenDiv('added-sellers', '');
        sellerDiv.innerHTML = result;
      }, parentInput);
    };

    await context.waitForXPath("//meta[@property='og:image']/@content", { timeout: 5000 })
      .catch(() => console.log('no product image available'));

    await context.waitForXPath("//p[@class='Directions']", { timeout: 6000 })
      .catch(() => console.log('no directions present'));

    await context.waitForXPath("//div[contains(@class,'about-desc')]/ul | //div[contains(@class,'about-item')]/div", { timeout: 30000 })
      .catch(() => console.log('no desc for item'));

    await context.waitForXPath('(//div[contains(@class,"prod-alt-image")]/img/@src)[position()!=1]', { timeout: 6000 })
      .catch(() => console.log('no alt Images'));

    await context.waitForXPath("//li//img[contains(@alt,'Shop at')]", { timeout: 30000 })
      .catch(()=>console.log('Wait complete'))

    await context.click('body');

    // await context.evaluate(()=>{
    //   let fullDescription = '';
    //   let descNodes = document.querySelectorAll('div[class*=about-desc],div[class*=DetailedHeroImage-ShortDescription],div[class*=AboutThisBundle-description],div[class*=about-item] div');
    //   descNodes.forEach(topNode=>{
    //     topNode.childNodes.forEach(node=>{
    //       if(node.nodeType === 3){
    //         fullDescription += node.textContent;
    //       }
    //     });

    //     // let lis = topNode.querySelectorAll('li');
    //     // lis.forEach(li=>{
    //     //   fullDescription += ' || ' + li.textContent; 
    //     // });
    //     // let other = topNode.querySelectorAll('*:not(li)');
    //     // other.forEach(ot=>{
    //     //   fullDescription += ot.textContent;
    //     // });

    //     function addHiddenDiv(id, content) {
    //       const newDiv = document.createElement('div');
    //       newDiv.id = id;
    //       newDiv.textContent = content;
    //       newDiv.style.display = 'none';
    //       document.body.appendChild(newDiv);
    //     }

    //     let excludeIndex = Math.min(fullDescription.indexOf('DIRECTIONS'), fullDescription.indexOf('WARNINGS'), fullDescription.indexOf('INGREDIENTS'));
    //     addHiddenDiv('my-desc', excludeIndex === -1 ? fullDescription : fullDescription.slice(0,excludeIndex));
    //   });

    //   return fullDescription;
    // });

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

    await addAdditionalContent();
    await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
  },
};
