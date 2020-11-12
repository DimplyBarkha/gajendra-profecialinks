const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: cleanUp,
    domain: 'waitrose.com',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails }) => {
      //remove cookies popup
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const cookies = document.querySelector('div.acceptCookieCTA___NwqHh button');
      if (cookies) cookies.click();
    });

    var detailsPage = await context.evaluate(async () => {
      if (document.querySelector('a[data-origincomponent="ProductPod"]') != null) {
        var productLink = document.querySelector('a[data-origincomponent="ProductPod"]').getAttribute('href');
      }
      return productLink;
    });
    if (detailsPage) {
      await context.goto('https://www.waitrose.com/' + detailsPage);
      await context.waitForNavigation();
    }
    var data = await context.extract(productDetails, { transform });

    for (let i = 0; i < data[0].group.length; i++) {
      if ('legalDisclaimer' in data[0].group[i]) {
        for (let j = 0; j < data[0].group[i].legalDisclaimer.length; j++) {
        data[0].group[i].legalDisclaimer[0].text += data[0].group[i].legalDisclaimer[j].text;
        }
        data[0].group[i].legalDisclaimer.splice(1, data[0].group[i].legalDisclaimer.length-1);
      }
      if ('recyclingInformation' in data[0].group[i]) {
        for (let j = 0; j < data[0].group[i].recyclingInformation.length; j++) {
        data[0].group[i].recyclingInformation[0].text += ', ' + data[0].group[i].recyclingInformation[j].text;
        }
        data[0].group[i].recyclingInformation.splice(1, data[0].group[i].recyclingInformation.length-1);
      }
    }
    return data;
  },

};
