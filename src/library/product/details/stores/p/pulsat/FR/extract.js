const { transform } = require('./shared');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // async function scroll () {
    //   let scrollTop = 0;
    //   while (scrollTop !== 60000) {
    //     await new Promise(resolve => setTimeout(resolve, 2000));
    //     scrollTop += 1000;
    //     window.scroll(0, scrollTop);
    //     if (scrollTop === 60000) {
    //       break;
    //     }
    //   }
    // }

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const productVariable = tc_vars;
    addHiddenDiv('sku', productVariable.product_sku);
    // addHiddenDiv('category', productVariable.product_category);
    productVariable.product_trademark && addHiddenDiv('brand', productVariable.product_trademark);
    productVariable.product_ean && addHiddenDiv('product_ean', productVariable.product_ean);
    productVariable.product_id && addHiddenDiv('product_id', productVariable.product_id);
    productVariable.product_name && addHiddenDiv('product_name', productVariable.product_name);
    productVariable.product_url_page && addHiddenDiv('product_url_page', productVariable.product_url_page);
    productVariable.product_url_picture && addHiddenDiv('product_image', productVariable.product_url_picture);
    productVariable.product_instock && addHiddenDiv('product_avail', productVariable.product_instock);
    // listPrice
    // @ts-ignore
    const listPice = (document.querySelector("meta[itemprop='price']")) ? document.querySelector("meta[itemprop='price']").getAttribute('content') : '';
    console.log('List price', listPice);
    console.log('price', productVariable.product_unitprice_ati);
    // eslint-disable-next-line eqeqeq
    if (listPice && productVariable.product_unitprice_ati && listPice != productVariable.product_unitprice_ati) {
      addHiddenDiv('listprice', productVariable.product_unitprice_ati);
    } else if (!listPice) {
      addHiddenDiv('price', productVariable.product_unitprice_ati);
    }
    // Scroll to rating
    // await scroll();
    // let ratingEle = document.querySelector("div[class*='netreviews-widget'] b").innerText;
    // console.log("Rating", ratingEle);
    // var element = (document.querySelectorAll('footer')) ? document.querySelectorAll('footer') : null;
    // if (element) {
    //   element.forEach(async (node) => {
    //     node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    //     await new Promise((resolve) => {
    //       setTimeout(resolve, 1000);
    //     });
    //   });
    // }
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
    // Weight
    const weightHeadings = document.evaluate("//td[contains(.,'Poids')]", document, null, XPathResult.ANY_TYPE, null);
    const weight = document.evaluate("//td[contains(.,'Poids')]/following-sibling::td", document, null, XPathResult.ANY_TYPE, null);
    const regex = /\((.*?)\)/;
    const weightUnit = regex.exec(weightHeadings.iterateNext().textContent)[1];
    addHiddenDiv('weightNet', weight.iterateNext().textContent.trim() + weightUnit);
    await infiniteScroll();
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    transform,
    domain: 'pulsat.fr',
    zipcode: '',
  },
  implementation,
};
