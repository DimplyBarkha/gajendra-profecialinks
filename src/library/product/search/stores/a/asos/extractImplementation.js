const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
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

  async function getProductsCount (context) {
    return context.evaluate(async function () {
      const products = document.evaluate('//div[@data-auto-id="productList"]//article[@data-auto-id="productTile"]//a//img/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      return products.snapshotLength;
    });
  }

  let productsCount = 0;
  while (productsCount < 150) {
    const doesLoadMoreExists = await context.evaluate(function () {
      return Boolean(document.querySelector('a[data-auto-id="loadMoreProducts"]'));
    });

    if (doesLoadMoreExists) {
      await context.evaluate(async function () {
        console.log('Clicking on load more button');
        document.querySelector('a[data-auto-id="loadMoreProducts"]').click();
        await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      });
      productsCount = await getProductsCount(context);
      console.log('productsCount' + productsCount);
      if (productsCount >= 150) {
        break;
      }
      await applyScroll(context);
    } else {
      break;
    }
  }

  return await context.extract(productDetails, { transform });
};

module.exports = { implementation };
