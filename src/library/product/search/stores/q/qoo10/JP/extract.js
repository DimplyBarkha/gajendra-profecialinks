
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const applyScroll = async function () {
      let scrollTop = window.scrollY;
      scrollTop = scrollTop + 5000;
      let scroll = window.scrollY;
      while (scroll !== scrollTop) {
        await stall(100);
        scroll += 500;
        window.scroll(0, scroll);
        if (scroll === scrollTop) {
          await stall(300);
          break;
        }
      }
    };

    const el = document.querySelector('div.pagingInfo div.btn_more');
    const totalCount = el.getAttribute('totalpage');
    const moreBtn = document.querySelector('div.pagingInfo a#btn_more_item');
    if (el) {
      new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      if (el && totalCount && moreBtn) {
        var i = 0;
        while (i <= totalCount) {
          await applyScroll();
          i++;
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    transform: null,
    domain: 'qoo10.jp',
    zipcode: '',
  },
  implementation,
};
