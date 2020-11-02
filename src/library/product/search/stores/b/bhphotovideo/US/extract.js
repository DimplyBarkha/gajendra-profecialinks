const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;



  // const prod = await context.evaluate(async () => {
    
  //   return JSON.parse((document.querySelector('div[class="aperture-body"]>script').innerText).replace(/^window.dlo = +/, ""));
  // });
  // console.log("coto?", typeof(prod));
  // console.log("coto??????????", prod);
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  await context.evaluate(async function () {
    const GetTagByIdUsingRegex = (tag, html) => {
      // return new RegExp('window.__PRELOADED_DATA .*[\\s\\S]?').exec(html);
      return new RegExp('<' + tag + '>window.dlo.*[\\s\\S]?(\n\t{3}var.*\n\t{3}BH.*\n\t{3}B.*\n\t{2})<\/' + tag + '>').exec(html)
    };

    await fetch(window.location.href, {
      method: 'GET',
    }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', htm);
      const outerHTML = result && result[0] ? result[0] : '';
      const dataStr = outerHTML && outerHTML.split('window.__PRELOADED_DATA = ') && outerHTML.split('window.__PRELOADED_DATA = ')[1] && outerHTML.split('window.__PRELOADED_DATA = ')[1].split('window.__SERVER_RENDER_TIME')[0] ? outerHTML.split('window.__PRELOADED_DATA = ')[1].split('window.__SERVER_RENDER_TIME')[0] : '';

      const manufactStr = dataStr && dataStr.split('fct_brand_name') ? '{' + dataStr.split('fct_brand_name')[1].split('[')[1].split(']')[0] + '}' : '';


      const obj = manufactStr.match(/(?<="name":").*?(?=",)/gs);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  });

  const windowScroll = await context.evaluate(async () => {
    for(let i=0;i<=document.body.scrollHeight;i=i+500){
      window.scroll(0,i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
  
  var data = await context.extract(productDetails, { transform });

  for(let i=0;i<data[0].group.length;i++){
    if("price" in data[0].group[i]){
      if(data[0].group[i].price.length==2){
        data[0].group[i].price[0].text += '.' + data[0].group[i].price[1].text;
        data[0].group[i].price.splice(1,1);
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
    transform: null,
    domain: 'bhphotovideo.com',
    zipcode: '',
  },
  implementation,
};
