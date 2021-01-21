const { cleanUp } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform: cleanUp,
    domain: 'mvideo.ru',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };

    await applyScroll(context);
    await context.evaluate(async function () {

      const descriptionTag = document.querySelector('a.text-cutter-link');

      if (descriptionTag) {
        descriptionTag.click();
        const description = document.querySelector('span.text-cutter-wrapper');
        document.body.setAttribute('description', description.textContent.replace(/\s+/g, ' '));
      }

      let specification = document.querySelector("div.c-specification.o-pdp-about-product-specification__block > table");
      if (specification) {
        document.body.setAttribute('specification', specification.textContent.replace(/\s+/g, ' '));
      }

      // let specsDivision = document.querySelectorAll("li.c-tabs__menu-item")[1]
      // if (specsDivision) {
      //   specsDivision.click()
      // }
      // await new Promise((resolve, reject) => setTimeout(resolve, 6000));



    });


    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('ul.c-tabs__menu-list> li:nth-child(2) > a'));
    });
    if (doesPopupExist) {
      await context.click('ul.c-tabs__menu-list> li:nth-child(2) > a');
      // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      try {
        await context.waitForSelector('div[class="product-details-tables-holder sel-characteristics-table"]>table', { timeout: 30000 })
        console.log('specification loaded successfully')
      } catch (e) {
        console.log('specification loaded successfully')
      }

    }
    await context.evaluate(async function () {
      const shipping = document.evaluate(`//h3[contains(text(),'Габаритные размеры')]/following::table[1]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (shipping) {
        document.body.setAttribute('shipping', shipping.textContent.replace(/\s+/g, ' '));
      }
      const productSpecification = document.querySelector("div.product-details-tables-holder.sel-characteristics-table");
      if (productSpecification) {
        document.body.setAttribute('productspecification', productSpecification.textContent.replace(/\s+/g, ' '));
      }
    });
    return await context.extract(productDetails, { transform });
  },
}