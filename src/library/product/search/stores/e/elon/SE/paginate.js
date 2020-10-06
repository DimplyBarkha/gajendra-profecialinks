async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const {
    nextLinkSelector,
    mutationSelector,
    loadedSelector,
    spinnerSelector,
  } = inputs;

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
  const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), 'div.toolbar--bottom > div > div.toolbar__pager.pages > div > ul > li.item.pages-item-next.pager__item.pager__item--next > a');
  if (!hasNextLink) {
    return false;
  }
  await context.click('div.toolbar--bottom > div > div.toolbar__pager.pages > div > ul > li.item.pages-item-next.pager__item.pager__item--next > a', {}, { timeout: 20000 });
  await context.waitForSelector('div[style="display: none;"][id="js-ajaxblocks-loader"]', { timeout: 20000 });
  return true;
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'elon',
    spinnerSelector: 'div[style="display: block;"][id="js-ajaxblocks-loader"]',
    domain: 'elon.se',
  },
  implementation,
};
