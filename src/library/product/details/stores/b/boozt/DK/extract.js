const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    transform: cleanUp,
    domain: 'boozt.com',
    zipcode: '',
  }, implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {

    await context.extract(productDetails);

    const allInfo = await context.evaluate(async function () {

      //taking all buttons with information about the product
      const infoBtns = document.querySelectorAll('div.pp-tabs__list button');

      var allInfoRaw = {
        'prodInfo': "",
        'careTips': "",
        'shippingInfo': ""
      }

      //iteration through all the buttons and click on them for loading the div with text
      for (let i = 0; i < infoBtns.length; i++) {
        if (infoBtns[i].innerText === "CARE TIPS") {
          infoBtns[i].click();
          await new Promise((r) => setTimeout(r, 1000));
          let careTips = document.querySelector("div.pp-tabs__content.pp-content").innerText;
          allInfoRaw.careTips = careTips;
        }
        else if (infoBtns[i].innerText === "SHIPPING & RETURNS") {
          infoBtns[i].click();
          await new Promise((r) => setTimeout(r, 1000));
          let shippingInfo = document.querySelector("div.pp-tabs__content.pp-content > div.pp-content__section").innerText;
          allInfoRaw.shippingInfo = shippingInfo;
        }
      }
      return allInfoRaw;
    });

    var dataRef = await context.data();

    if (!("productOtherInformation" in dataRef[0].data[0].group[0])) {
      dataRef[0].data[0].group[0].productOtherInformation = [{ text: allInfo.careTips }];
    } else if ("text" in dataRef[0].data[0].group[0].productOtherInformation[0]) {
      dataRef[0].data[0].group[0].productOtherInformation[0].text = allInfo.careTips;
    } else {
      dataRef[0].data[0].group[0].productOtherInformation[0].push({ text: allInfo.careTips });
    }

    if (!("shippingInfo" in dataRef[0].data[0].group[0])) {
      dataRef[0].data[0].group[0].shippingInfo = [{ text: allInfo.shippingInfo }];
    } else if ("text" in dataRef[0].data[0].group[0].shippingInfo[0]) {
      dataRef[0].data[0].group[0].shippingInfo[0].text = allInfo.shippingInfo;
    } else {
      dataRef[0].data[0].group[0].shippingInfo[0].push({ text: allInfo.shippingInfo });
    }

  },
};