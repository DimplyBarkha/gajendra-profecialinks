var { transform } = require("../format");

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 10000) {
        await stall(1000);
        scrollTop += 250;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const num = await context.evaluate(async function () {
    const product = document.querySelectorAll('ul#searchItems li');
    var p = (product[0].innerText).split(" ");
    var num = p[p.length - 2];
    return parseFloat(num) / 24;
  });

  let URL = await context.evaluate(async function () {
    return window.location.href;
  });

  for(var j=2;j<=num;j++){
  if(URL.indexOf("p=") > -1){
    URL = (URL).split("&")[0] + "&p=" + (j + 1);
  }
  else{
    URL = URL + "&p=" + (j + 1);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  await context.goto(URL, {
    firstRequestTimeout: 60000,
    timeout: 9999999,
    waitUntil: 'load',
    checkBlocked: false,
    });

  await context.evaluate(async function (URL) {

    var showMore = document.querySelector("#ShowMore");
    const product = document.querySelectorAll('ul#searchItems li');
    //let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul#searchItems li')[index];
      originalDiv.appendChild(newDiv);
    }
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      console.log(product[i].querySelector("#page_url"));
      if (!product[i].querySelector("#page_url")){
        addHiddenDiv('page_url', URL, i);
      }
    }
  },URL);
  }
  await applyScroll(context);


  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'sweetcare',
    transform,
    domain: 'sweetcare.pt',
    zipcode: '',
  },implementation
};
