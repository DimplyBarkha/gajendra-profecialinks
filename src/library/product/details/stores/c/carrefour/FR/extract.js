const { transform } = require('../FR/shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const cssProduct = "a.product-card-image";
    const cssProductDetails = 'div.pdp__main';

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector(cssProduct, { timeout: 10000 });

    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      await context.click(cssProduct);
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      await context.waitForSelector(cssProductDetails);
      const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
      console.log(`productDetailsAvailable: ${productDetailsAvailable}`);
      if (!productDetailsAvailable) {
        throw new Error('ERROR: Failed to load product details page');
      }
      console.log('navigation complete!!');
    }
    await context.evaluate(async function () {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await context.waitForXPath('//button[@id="footer_tc_privacy_button"]', { timeout: 30000 });
        let cookieButton = document.querySelector('button#footer_tc_privacy_button');
        if (cookieButton) {
          // @ts-ignore
          cookieButton.click();
        }
      } catch (error) {
        console.log('error: ', error);
  
      }
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
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }catch(error){
        console.log(error)
      }
      let clickLoadMore = document.querySelector('button.paragraph-truncate__see-more');
      // @ts-ignore
      clickLoadMore = clickLoadMore ? clickLoadMore.click() : '';
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let enhancedDescHTML = document.querySelector('div#flix-inpage');
      let enhancedDesc = enhancedDescHTML ? enhancedDescHTML.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      addHiddenDiv('cr_enhancedContent',enhancedDesc);
      let specTrs = document.querySelectorAll('div.secondary-details__characteristics-table table tr');
      let finalSpecArr = [];
      let fieldVal = '';
      let field;
      let value;
      for (let index = 0; index < specTrs.length; index++) {
        const element = specTrs[index];
        field = element.querySelector('td:nth-child(1)')
        // @ts-ignore
        let fieldStr = field ? field.innerText : '';
        value = element.querySelector('td:nth-child(2)');
        // @ts-ignore
        let valueStr = value ? value.innerText : '';
        if(fieldStr && valueStr){
          let fieldVal = fieldStr+' : '+valueStr;
          finalSpecArr.push(fieldVal);
        }

      }
      let finalSpecStr
      if(finalSpecArr.length > 0){
        finalSpecStr = finalSpecArr.join(' || ');
      }
      addHiddenDiv('cr_specification',finalSpecStr );
      // @ts-ignore
      let tc_vars = window.tc_vars;
      let brand = tc_vars ? tc_vars.product_brand : '';
      addHiddenDiv('cr_brand',brand);
    })
    return await context.extract(productDetails, { transform });
  }
};

