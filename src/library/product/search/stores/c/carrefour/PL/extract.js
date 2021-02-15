const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(10000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  await context.evaluate(async function () {
    let impressions = [];

    const jsonSelector = document.querySelector('script[id="__NEXT_DATA__"]');
    if (jsonSelector) {
      const data = jsonSelector.innerText;
      if (data) {
        const jsonData = JSON.parse(data);
        const props = jsonData.props;
        let initialState;

        if (props) {
          initialState = props.initialState;
          if (initialState) {
            impressions = initialState.gtm.ecommerceForContentView.impressions;
            // if (impressions) {
            //   impressions.forEach((item, index) => {
            //     const prodId = item.id;

            //   });
            // }
          }
        }

        const items = document.querySelectorAll('div.MuiBox-root div.jss259');
        if (items && impressions) {
          items.forEach((item, index) => {
            const button = item.querySelector('button.MuiButtonBase-root');
            const product = impressions[index];
            if (product) {
              button.setAttribute('my-prodId', product.id);
            }
          });
        }
      }
    }
    return `data ::: ${impressions}`;
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'carrefour',
    transform,
    domain: 'carrefour.pl',
    zipcode: '',
  },
  implementation,
};
