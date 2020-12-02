const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // let elements = await context.evaluate(async () => {
  //   return document.querySelectorAll('article[class="Item Fashion  "]').length;
  // });
  // while (elements < 150) {
  //   let location1 = await context.evaluate(async () => {
  //     return window.location.href;
  //   });
  //   console.log(location1);
  //   await context.evaluate(async () => {
  //     window.scrollTo({ top: (document.body.scrollHeight) - 1500, behavior: 'smooth' });
  //     await new Promise((resolve, reject) => setTimeout(resolve, 1500));
  //   });
  //   let location2 = await context.evaluate(async () => {
  //     return window.location.href;
  //   });
  //   console.log(location2);
  //   elements = await context.evaluate(async () => {
  //     return document.querySelectorAll('article[class="Item Fashion  "]').length;
  //   });
  //   console.log('na końcu!!!!!!!', elements);
  //   if (location1 === location2) {
  //     break;
  //   }
  // }
  await context.evaluate(async function () {
    let elements = document.querySelectorAll('article[class="Item Fashion  "]');
    while (elements.length < 150) {
      let location1 = window.location.href;
      window.scrollTo({ top: (document.body.scrollHeight) - 1500, behavior: 'smooth' });
      await new Promise((resolve, reject) => setTimeout(resolve, 1500));
      elements = document.querySelectorAll('article[class="Item Fashion  "]');
      let location2 = window.location.href;
      if (location1 === location2) {
        break;
      }
    } 
  });

  var data = await context.extract(productDetails, { transform });
  for (let i = 0; i < data[0].group.length; i++) {
    if ('thumbnail' in data[0].group[i]) {
      if (data[0].group[i].thumbnail[0].text.includes('greyPlaceholder') && data[0].group[i].id) {
        data[0].group[i].thumbnail[0].text = data[0].group[i].thumbnail[0].text.replace('greyPlaceholder', data[0].group[i].id[0].text);
      }
    } 
    if (data[0].group[i].aggregateRating2) {
      let rating = data[0].group[i].aggregateRating2[0].text;
      data[0].group[i].aggregateRating2[0].text = rating[0] + ',' + rating[1];
    }
  }

  return data;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'next',
    transform: transform,
    domain: 'next.co.uk',
    zipcode: '',
  },
  implementation
};
