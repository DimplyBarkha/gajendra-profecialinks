const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
<<<<<<< HEAD
  // await context.evaluate(async () => {
  //   while(!!document.querySelector("#container > div > div:nth-child(1) > div > main > div > div:nth-child(1) > div._2megZ9._3-XKWb > button")){
  //     // @ts-ignore
  //     document.querySelector("#container > div > div:nth-child(1) > div > main > div > div:nth-child(1) > div._2megZ9._3-XKWb > button").click()
  //     await new Promise(r => setTimeout(r, 10000));
  //   }
  // })
  const applyScroll = async function (context) {
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 1000) {
      scrollTop += 500;
      window.scroll(0, scrollTop);
      await stall(1000);
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  })
}
  await applyScroll(context);

  
=======
  // await context.evaluate(async function () {
    
      
  //     while(!!document.querySelector("#container > div > div:nth-child(1) > div > main > div > div:nth-child(1) > div._2megZ9._3-XKWb > button")){
  //       // @ts-ignore
  //       document.querySelector("#container > div > div:nth-child(1) > div > main > div > div:nth-child(1) > div._2megZ9._3-XKWb > button").click()
        
  //       await new Promise(r => setTimeout(r, 10000));
  //     }

    
  // })
  await context.evaluate(async function () {
  let scrollTop = 0;
  while (scrollTop !== 1000) {
    await stall(500);
    scrollTop += 1000;
    window.scroll(0, scrollTop);
    if (scrollTop === 1000) {
      await stall(500);
      break;
    }
  }
  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
})
>>>>>>> 839d23caab0500f410ce46c0090b7c5d4fb7f0ee
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'lyko',
    transform: transform,
    domain: 'lyko.com',
    zipcode: '',
  },
  implementation,
};
