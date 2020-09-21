const { transform } = require('../IT/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    transform,
    domain: 'expertonline.it',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 6000));
    } catch (error) {
      console.log(error)
    }
    //------------------------------------
    let nextLink = document.querySelectorAll('ul.pagination');
    let ul ;
    if(nextLink.length > 0){
      ul = nextLink[0];
    }else if(nextLink.length = 1){
      ul = nextLink[0];
    }
    let finalUl = ul;
    let activeUl = ul.querySelector('li.active');
    let nextSibling = activeUl.nextElementSibling;
    // @ts-ignore
    console.log('nextSibling: ', nextSibling.innerText);
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('a');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.href = content;
      // newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let hrefLink = nextSibling ? nextSibling.querySelector('a') : '';
    // @ts-ignore
    hrefLink = hrefLink ? hrefLink.href : '';
    // @ts-ignore
    if(hrefLink.includes('https://www.')){
    hrefLink = hrefLink;
    }else{
      hrefLink = 'https://www.expertonline.it'+hrefLink;
    }
    // @ts-ignore
    if(nextSibling.innerText === "»"){
      console.log('Next link is last');
    }else{
      addHiddenDiv('nextLinkSelector', hrefLink)
    }
   //-----------------------------------------------------------------------
    async function infiniteScroll() {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
  })

  return await context.extract(productDetails, { transform });
}
