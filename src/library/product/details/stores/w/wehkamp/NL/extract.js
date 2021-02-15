const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'wehkamp',
    transform,
    domain: 'wehkamp.nl',
    zipcode: '',
  },
  implementation,
};


async function implementation   (
  inputs,
  parameters,
  context,
  dependencies,
)  {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  
  // let btnSel = "div[class='H_j8WO position-relative'] button";
  // let hasBtn = false;
  // try {
  //   await context.waitForSelector(btnSel);
  //   console.log('got the btn');
  //   hasBtn = true;
  // } catch(err) {
  //   console.log('got some error while waiting for the btn', err.message);
  //   try {
  //     await context.waitForSelector(btnSel);
  //     console.log('got the btn');
  //     hasBtn = true;
  //   } catch(error) {
  //     console.log('got some error while waiting for the btn, again', error.message);
  //   }
  // }

  // if(hasBtn) {
  //   await context.click(btnSel);
  //   await new Promise(resolve => setTimeout(resolve, 3000));
  // }
  try{
    let node = await context.evaluate(async function () {
      return document.querySelectorAll(`div[class='H_j8WO position-relative'] button`);
    });

    if(JSON.stringify(node) !== '{}'){
      await context.click(`div[class='H_j8WO position-relative'] button`);
      await new Promise(resolve => setTimeout(resolve, 90000));
    }
  }catch(exception){
    console.log("Exception ",exception);
  }
  return await context.extract(productDetails, { transform });
};