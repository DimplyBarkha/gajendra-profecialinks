const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    transform: transform,
    domain: 'staples.co.uk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await context.setViewport({ width: 640, height: 480 });
    await context.evaluate(async function () {
      let cookiePopup = document.querySelector('#btnCookieContainer > input.accept-all-cookies');
      // @ts-ignore
      cookiePopup = cookiePopup ? cookiePopup.click() : '';
      // let winPopup = document.querySelector('div.wpcss-close-popup');
      // // @ts-ignore
      // winPopup = winPopup ? winPopup.click() : '';
      // let vatPopup = document.querySelector("#VATContent > div.dvVatCnt.alignCenter.clear > div.dvCustType.L > div.formRow > input");
      // // @ts-ignore
      // vatPopup = vatPopup ? vatPopup.click() : '';
      let lightbox = document.querySelector('div#light_box_global');
      // @ts-ignore
      lightbox = lightbox ? lightbox.click() : '';
      // const element = document.querySelector('div.skutabDesc');
      // // @ts-ignore
      // element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });
    return await context.extract(productDetails, { transform });
  },
};
