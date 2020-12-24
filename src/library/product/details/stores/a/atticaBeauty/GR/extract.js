const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GR',
    store: 'atticaBeauty',
    transform: transform,
    domain: 'atticadps.gr',
    zipcode: "''",
  },
  // implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
  //   await new Promise(resolve => setTimeout(resolve, 10000));

  //   await context.evaluate(function () {
  //     function addHiddenDiv (id, content) {
  //       const newDiv = document.createElement('div');
  //       newDiv.id = id;
  //       newDiv.textContent = content;
  //       newDiv.style.display = 'none';
  //       document.body.appendChild(newDiv);
  //     }
  //     let scrollTop = 500;
  //     while (true) {
  //       window.scroll(0, scrollTop);
  //       // await stall(1000);
  //       scrollTop += 500;
  //       if (scrollTop === 10000) {
  //         break;
  //       }
  //     }
  //     if (document.querySelectorAll('div.colors ul li a')) {
  //       const variants = [];
  //       const node = document.querySelectorAll('div.colors ul li a');
  //       for (const i in node) {
  //       // @ts-ignore
  //         if (node[i].href) variants.push(node[i].href);
  //         console.log(variants);
  //       }
  //       if (variants) addHiddenDiv('ii_variants', variants);
  //     }
  //   });

  //   return await context.extract(productDetails, { transform });
  // },
};
