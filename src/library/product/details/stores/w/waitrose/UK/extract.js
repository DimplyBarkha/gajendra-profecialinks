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
    // remove cookies popup
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
      await context.goto('https://www.waitrose.com' + detailsPage);
      await context.waitForNavigation();
    }
    await context.evaluate(async () => {
      // add productUrl
      var productUrl = window.location.href;
      if (productUrl !== null) {
        const element = document.createElement('a');
        element.id = 'productUrl';
        element.title = productUrl;
        element.style.display = 'none';
        document.body.appendChild(element);
      }
    });
    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('caloriesPerServing' in data[k].group[i] && data[k].group[i].caloriesPerServing.length > 1) {
          data[k].group[i].caloriesPerServing[0].text += '/' + data[k].group[i].caloriesPerServing[1].text;
          data[k].group[i].caloriesPerServing = data[k].group[i].caloriesPerServing.slice(0, 1);
        }
        if ('additives' in data[k].group[i] && data[k].group[i].additives.length > 1) {
          for (let j = 1; j < data[k].group[i].additives.length; j++) {
            data[k].group[i].additives[0].text += ' ' + data[k].group[i].additives[j].text;
          }
          data[k].group[i].additives = data[k].group[i].additives.slice(0, 1);
        }
        if ('availabilityText' in data[k].group[i] && data[k].group[i].availabilityText[0].text !== 'Out of Stock') {
          data[k].group[i].availabilityText[0].text = 'In Stock';
        }
        if ('pricePerUnitUom' in data[k].group[i]) {
          data[k].group[i].pricePerUnitUom[0].text = data[k].group[i].pricePerUnitUom[0].text.match(/(\w+)[)]/)[1];
        }
        if ('legalDisclaimer' in data[k].group[i]) {
          for (let j = 0; j < data[k].group[i].legalDisclaimer.length; j++) {
            data[k].group[i].legalDisclaimer[k].text += data[k].group[i].legalDisclaimer[j].text;
          }
          data[k].group[i].legalDisclaimer.splice(1, data[k].group[i].legalDisclaimer.length - 1);
        }
        if ('warnings' in data[k].group[i]) {
          data[k].group[i].warnings[0].text = data[k].group[i].warnings[0].text.replace(/<br>/g,' ');
        }
        if ('price' in data[k].group[i] && data[k].group[i].price[0].text.includes('p')) {
          data[k].group[i].price[0].text = (Number(data[k].group[i].price[0].text.replace(/p/g,''))/100).toString();
        }
        if ('pricePerUnit' in data[k].group[i] && data[k].group[i].pricePerUnit[0].text.includes('p')) {
          data[k].group[i].pricePerUnit[0].text = (Number(data[k].group[i].pricePerUnit[0].text.replace(/p/g,''))/100).toString();
        }
        if ('recyclingInformation' in data[k].group[i]) {
          for (let j = 0; j < data[k].group[i].recyclingInformation.length; j++) {
            data[k].group[i].recyclingInformation[k].text += ', ' + data[k].group[i].recyclingInformation[j].text;
          }
          data[k].group[i].recyclingInformation.splice(1, data[k].group[i].recyclingInformation.length - 1);
        }
      }
    }
    return data;
  },

};
