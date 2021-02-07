const { transform } = require('../format');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   console.log('inputs:: ', inputs);
//   const { url, id } = inputs;
//   console.log('parameters:: ', parameters);
//   if (id) {
//     await new Promise((resolve, reject) => setTimeout(resolve, 10000));
//     await context.waitForXPath('//div[@class="ProductCard__ProductContainer-sc-2vuvzo-2 gVgtAI"]/a');

//     await context.waitForSelector('div.ProductCard__ProductContainer-sc-2vuvzo-2.gVgtAI a');
//     console.log('everything fine !!!');
//     await context.evaluate(() => {
//       const firstItem = document.querySelector('div.ProductCard__ProductContainer-sc-2vuvzo-2.gVgtAI a');
//       firstItem.click();
//     });
//   }
//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    // transform,
    domain: 'casasbahia.com.br',
    zipcode: "''",
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise(resolve => setTimeout(resolve, 2000));

    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(500);
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
    await context.evaluate(async () => {
      // const descNode = document.querySelector('div.product-info-description');
      let desc = '';
      const images = [];
      // if (descNode && descNode.innerText) {
      //   desc = descNode.innerText;
      //   desc = desc.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
      // }
      try {
        const descNode1 = document.querySelector('div.pd-image-full');
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (descNode1 && descNode1.shadowRoot) {
          const fetchNode = descNode1.shadowRoot.firstChild;
          const text = fetchNode.innerText;
          desc = desc + text;
          const manImages = fetchNode.querySelectorAll('img');
          if (manImages && manImages.length > 0) {
            for (let i = 0; i < manImages.length; i++) {
              images.push(manImages[i].src);
            }
          }
        }
      } catch (err) { }
      if (images.length > 0) {
        const image = images.join(' | ');
        addHiddenDiv('manuf-images', image);
      }
      if (desc.length > 0) {
        addHiddenDiv('product-desc', desc);
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      return [`desc.length = ${desc}`, `images : ${images.length}`];
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // await context.evaluate(async function () {
    //   const desc = document.querySelector('div.syndi_powerpage');
    //   if (desc) {
    //     let text = desc.shadowRoot.firstChild.innerText;
    //     text = text.replace('/g\n\s{1,}/', '');
    //   }
    // })
    // }  

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
