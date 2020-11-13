const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    transform: cleanUp,
    domain: 'marionnaud.fr',
    zipcode: '',
  },
implementation: async (
  inputs,
  parameters,
  context,
  dependencies,
) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content,index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("li[class='col-lg-3 col-md-3 col-sm-4']")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rankOrganic;
    let url = window.location.href;
    let checkPageNumber = url.split('&')[2];
    try {
      if (checkPageNumber.startsWith('page=')) {
        rankOrganic = checkPageNumber.replace('page=', '');
      }
    }
    catch (err) {
    }
    if (!rankOrganic) {
      rankOrganic = 1;
    } else {
      rankOrganic = (parseInt(rankOrganic) * 100) + 1;
    }
    const urlProduct = document.querySelectorAll("li[class='col-lg-3 col-md-3 col-sm-4']");
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }
    const price = document.querySelectorAll('div.productMainLink div.infoTextCarousel div span.lineinner');
    //const length1=price.length
    for (let k = 0; k < price.length; k++) {
      // @ts-ignore
      let priceText = price[k].textContent;
      if (priceText.includes('€')) {
            priceText = priceText.replace('€', '.');
            priceText=priceText+'€'
          }
          addHiddenDiv('priceText', priceText,k);
    }
    
    const aggregateRating = document.querySelectorAll("div[class='star-rating__filled-stars']")
    for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1)
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      addHiddenDiv('aggregateRating', singleRating, k);
    }
    const thumbnail=document.querySelectorAll("div.product_img img.primImg.primaryImage_prodcat")
    for(let i=0;i< thumbnail.length;i++){
      let thumbnailSrc=document.querySelectorAll("div.product_img img.primImg.primaryImage_prodcat")[i].getAttribute('data-src')
      let finalImageSrc=' https://www.marionnaud.fr'+thumbnailSrc
      addHiddenDiv('thumbnailSrc', finalImageSrc, i);
    }
    const productUrl=document.querySelectorAll("a.ProductInfoAnchor")
    for(let i=0;i<productUrl.length;i++){
      let urlHref=document.querySelectorAll("a.ProductInfoAnchor")[i].href
      addHiddenDiv('productUrl', urlHref, i);
    }
 });
 return await context.extract(productDetails, { transform });
 }
};
