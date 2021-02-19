const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ag_parfetts',
    transform: cleanUp,
    domain: 'online.parfetts.co.uk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    const elem = await context.evaluate(function () {
      return Boolean(document.querySelector('.infinite-scroll-pagination div[class*="product-card"] a'));
    });
    if (elem) {
      await context.waitForSelector('.infinite-scroll-pagination div[class*="product-card"] a');
      await context.evaluate(async function () {
        const seeAllSelector = document.querySelector('.infinite-scroll-pagination div[class*="product-card"] a');
        if (seeAllSelector) {
          seeAllSelector.click();
        }
      });
    }
    // await autoScroll(context);
    const elem1 = await context.evaluate(function () {
      return Boolean(document.querySelector('[class*="login-prompt"] >a'));
    });
    if (elem1) {
      await context.waitForSelector('[class*="login-prompt"] >a');
      await context.click('[class*="login-prompt"] >a');
      // }
      // if (document.querySelector('div[class*="login-page"] div[class*="row"] input[name="email"]')) {
      await context.waitForSelector('div[class*="login-page"] div[class*="row"] input[name="email"]');
      await context.setInputValue('div[class*="login-page"] div[class*="row"] input[name="email"]', `print@parfetts.co.uk`);
      await context.waitForSelector('div[class*="login-page"] div[class*="row"] input[name="password"]');
      await context.setInputValue('div[class*="login-page"] div[class*="row"] input[name="password"]', `parfettssupplier`);
      await context.waitForSelector('#__next > div.undefined.page-wrapper > div.column-wrapper.main-content-wrapper > div.main-column > div > div > div > div > div > form > div:nth-child(5) > div > button');
      await context.click('#__next > div.undefined.page-wrapper > div.column-wrapper.main-content-wrapper > div.main-column > div > div > div > div > div > form > div:nth-child(5) > div > button');
      await context.waitForSelector('[class="bg-white"]>h1');
      await context.waitForSelector('div[class="product-page"] div[class*="col-12"] h1');
      await applyScroll(context);
    }
    //   return await context.extract(productDetails, { transform });
    // }
    await context.evaluate(async function () {
      function addTempDiv(id, data) {
        const tempDiv = document.createElement('div');
        tempDiv.id = id;
        tempDiv.textContent = data;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
      }
      // ingredientsList, bullet info and bullet counts
      const ingredientsList = [];
      if (document.querySelectorAll('div[class="product-page"] ul[class*="ingredients"]>li')) {
        const node = document.querySelectorAll('div[class="product-page"] ul[class*="ingredients"]>li');
        for (const i in node) {
          // @ts-ignore
          if (node[i].textContent) ingredientsList.push(node[i].textContent);
        }
        addTempDiv('mod_ingredientsList', ingredientsList.join(', '));
      }
      const specification = [];
      if (document.querySelectorAll('div[class="product-page"] div[class*="col-12"] div[class="rt-table"] div[class="rt-td"]')) {
        const node = document.querySelectorAll('div[class="product-page"] div[class*="col-12"] div[class="rt-table"] div[class="rt-td"]');
        for (const i in node) {
          // @ts-ignore
          if (node[i].textContent) specification.push(node[i].textContent);
        }
        addTempDiv('mod_specification', specification.join(' '));
      }
      const description = [];
      if (document.querySelectorAll('div[class="product-page"] div[class*="col-12"] p')) {
        const node = document.querySelectorAll('div[class="product-page"] div[class*="col-12"] p');
        for (const i in node) {
          // @ts-ignore
          if (node[i].textContent) description.push(node[i].textContent);
        }
        addTempDiv('mod_description', description.join(' | '));
      }
    });
    return await context.extract(productDetails, { transform });
  }
}
