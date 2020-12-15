const {transform} = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  // await context.evaluate(async function () {
  //   await new Promise(resolve => setTimeout(resolve, 100));
  //   for (let i = 0; i < 10; i++) {
  //     document.getElementById("main").scrollBy({ top: 5000, left: 0, behaviour: 'smooth'});
  //     // window.scrollBy({ top: 1000, left: 0, behavior: "smooth" });
  //     await new Promise(resolve => setTimeout(resolve, 500));
  //     console.log("scrolling");
  //   }
  // });
  await context.evaluate(async () => {

    let scrolltop = document.getElementById("main").scrollTop;

    while(!!document.querySelector('div.btn-view-more-products > button')){
      document.querySelector('div.btn-view-more-products > button').click();
      await new Promise(r => setTimeout(r, 1000));
    }

    document.getElementById("main").scrollBy({ top: 1000, left: 0, behavior: 'smooth'});
    await new Promise(r => setTimeout(r, 1000));

    let thmcount = document.querySelectorAll('ul.productGroup li.item img[src]').length;
    let itemcount = document.querySelectorAll('ul.productGroup li.item').length;

    while(itemcount!=thmcount){
      let newscrolltop = document.getElementById("main").scrollTop;
      document.getElementById("main").scrollBy({ top: newscrolltop-scrolltop, left: 0, behavior: 'smooth'});
      scrolltop = newscrolltop;
      await new Promise(r => setTimeout(r, 500));
      let newthmcount = document.querySelectorAll('ul.productGroup li.item img[src]').length;
      let newitemcount = document.querySelectorAll('ul.productGroup li.item').length;
      if(newthmcount==newitemcount){
        break;
      }
    }

  })
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    transform : transform,
    domain: 'migros.ch',
  },
  implementation,
};
