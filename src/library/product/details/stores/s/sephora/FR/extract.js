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
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const tabsAccordion = document.querySelectorAll('ul[role="tablist"][class="tabs"] li[class*="product-info-accordion-tab"]');

    [...tabsAccordion].forEach(async function (element, i) {
      await element.click();
      if (element.innerText.includes("Conseils D'utilisation")) {
        const directionText = document.querySelector('div.tabs-content div.tabs-panel.is-active');
        await addHiddenDiv('ii_directions', directionText ? directionText.innerText : '');
      }
      console.log(tabsAccordion.length);
      console.log(i);
      if (i === tabsAccordion.length-1) {
        await tabsAccordion[0].click();
      }
    });
  });
  return await context.extract(productDetails, { transform });
}
