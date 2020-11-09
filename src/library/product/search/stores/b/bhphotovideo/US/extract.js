const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const manuf = await context.evaluate(async function () {
    const GetTagByIdUsingRegex = (tag, html) => {
      return new RegExp('<' + tag + '>window.dlo.*[\\s\\S]?(\n\t{3}var.*\n\t{3}BH.*\n\t{3}B.*\n\t{2})</' + tag + '>').exec(html);
    };

    const manufactArr = await fetch(window.location.href, {
      method: 'GET',
    }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', htm);
      const outerHTML = result && result[0] ? result[0] : '';
      const dataStr = outerHTML && outerHTML.split('window.__PRELOADED_DATA = ') && outerHTML.split('window.__PRELOADED_DATA = ')[1] && outerHTML.split('window.__PRELOADED_DATA = ')[1].split('window.__SERVER_RENDER_TIME')[0] ? outerHTML.split('window.__PRELOADED_DATA = ')[1].split('window.__SERVER_RENDER_TIME')[0] : '';

      if (dataStr.split('fct_brand_name')[1] === undefined) {
        const obj = [];
        return obj;
      }

      const manufactStr = dataStr && dataStr.split('fct_brand_name') ? '{' + dataStr.split('fct_brand_name')[1].split('[')[1].split(']')[0] + '}' : '';

      const obj = manufactStr.match(/(?<="name":").*?(?=",)/gs);
      console.log(obj);
      return obj;
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    return manufactArr;
  });

  await context.evaluate(async () => {
    for (let i = 0; i <= document.body.scrollHeight; i = i + 500) {
      window.scroll(0, i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
  var data = await context.extract(productDetails, { transform });
  for (let i = 0; i < data[0].group.length; i++) {
    if ('price' in data[0].group[i]) {
      if (data[0].group[i].price.length === 2) {
        data[0].group[i].price[0].text += '.' + data[0].group[i].price[1].text;
        data[0].group[i].price.splice(1, 1);
      }
    }
    if ('manufacturer' in data[0].group[i]) {
      if (manuf.length === 0) {
        data[0].group[i].manufacturer[0].text = '';
      } else {
        for (let j = 0; j < manuf.length; j++) {
          if (data[0].group[i].manufacturer[0].text.toLowerCase().replace('-', ' ').includes(manuf[j].toLowerCase().replace('-', ' '))) {
            data[0].group[i].manufacturer[0].text = manuf[j];
            break;
          }
        }
      }
    }
  }
  return data;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    transform: transform,
    domain: 'bhphotovideo.com',
    zipcode: '',
  },
  implementation,
};
