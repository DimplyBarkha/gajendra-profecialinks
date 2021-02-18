const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'sephora',
    transform,
    domain: 'sephora.fr',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2500));

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
  try {
    await context.waitForSelector('button#popin_tc_privacy_button', { timeout: 5000 });
    await context.click('button#popin_tc_privacy_button');
  } catch (error) {
    console.log('No pop-ups');
  }
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const tabsAccordion = document.querySelectorAll('ul[role="tablist"][class="tabs"] li[class*="product-info-accordion-tab"]');

    [...tabsAccordion].forEach(async function (element, j) {
      await element.click();
      if (element.innerText.includes("Conseils D'utilisation")) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const directionText = document.querySelector('div.tabs-content div.tabs-panel.is-active');
        await addHiddenDiv('ii_directions', directionText ? directionText.innerText : '');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      console.log(tabsAccordion.length);
      console.log(j);
      if (j === tabsAccordion.length-1) {
        await tabsAccordion[0].click();
      }
    });

    const variationButtons = document.querySelectorAll('div.variation-button-line button');
    const varButtonsObj = {};
    [...variationButtons].forEach(function (element) {
      const currentPrice = element.querySelector('span.price-sales') ? element.querySelector('span.price-sales').innerText : '';
      const oldPrice = element.querySelector('span.price-standard') ? element.querySelector('span.price-standard').innerText : '';
      varButtonsObj[element.getAttribute('data-pid')] = { price: currentPrice, old_price: oldPrice };
    });

    const variationList = document.querySelectorAll('div.product-variations li');
    [...variationList].forEach(function (element) {
      const productId = element.querySelector('a').getAttribute('data-pid');
      if (varButtonsObj[productId]) {
        element.querySelector('a').setAttribute('ii_current_price', varButtonsObj[productId].price);
        element.querySelector('a').setAttribute('ii_old_price', varButtonsObj[productId].old_price);
      }
    });
  });
  /*
  const productVariations = await context.evaluate(function () { 
    return document.querySelectorAll('div.product-variations li').length;
  });
  for (let i = 1; i <= productVariations; i++) {
    try {
      await context.waitForSelector('button#popin_tc_privacy_button', { timeout: 5000 });
      await context.click('button#popin_tc_privacy_button');
    } catch (error) {
      console.log('No pop-ups');
    }
    await context.evaluate(function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const tabsAccordion = document.querySelectorAll('ul[role="tablist"][class="tabs"] li[class*="product-info-accordion-tab"]');

      [...tabsAccordion].forEach(async function (element, j) {
        await element.click();
        if (element.innerText.includes("Conseils D'utilisation")) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const directionText = document.querySelector('div.tabs-content div.tabs-panel.is-active');
          await addHiddenDiv('ii_directions', directionText ? directionText.innerText : '');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(tabsAccordion.length);
        console.log(j);
        if (j === tabsAccordion.length-1) {
          await tabsAccordion[0].click();
        }
      });
    });
    await context.click(`div.product-variations li:nth-child(${i})`);
    await context.waitForNavigation();

    await new Promise((resolve) => setTimeout(resolve, 3500));
    await context.extract(productDetails, { transform });
  }
  */
  return await context.extract(productDetails, { transform });
}
