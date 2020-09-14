
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'carrefouruae',
    transform,
    domain: 'carrefouruae.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      }
      let shippingArr = [];
      let warrantyArr = [];
      let shippingFinal;
      let warrantyFinal;
      let shippingInfo ;
      let shippingInfo1 = document.querySelectorAll('div.productinfo__header div.productinfo-misc__box');
      let shippingInfo2 = document.querySelectorAll('div.css-1sk1hfz');
      if(shippingInfo1.length > 0){
        shippingInfo = shippingInfo1;
      }else if(shippingInfo2.length > 0){
        shippingInfo = shippingInfo2
      }
      for (let index = 0; index < shippingInfo.length; index++) {
        // @ts-ignore
        const element = shippingInfo[index].innerText;
        if((element.includes('Sold by'))){
          shippingArr.push(element)
        }
        if((element.includes('warranty')) || (element.includes('Warranty'))){
          warrantyArr.push(element);
        }
      }
      shippingFinal = shippingArr.join(' ');
      addHiddenDiv('cc_shippingInfo',shippingFinal);
      warrantyFinal = warrantyArr.join(' ');
      addHiddenDiv('cc_warranty',warrantyFinal);
      // @ts-ignore
      let json = window.__NEXT_DATA__;
      json = json ? json.props : '';
      let initialProps = json ? json.initialProps : '';
      initialProps = initialProps ? initialProps.pageProps : '';
      let initialData = initialProps ? initialProps.initialData : '';
      let onlineName = initialData ? initialData.onlineName : '';
      addHiddenDiv('cc_name',onlineName);
      let listPrice = initialData ? initialData.price : '';
      listPrice = listPrice ? listPrice.price : '';
      addHiddenDiv('cc_listPrice', listPrice);
      let gtin = initialData ? initialData.ean : '';
      addHiddenDiv('cc_gtin', gtin);
      let variantId = initialData ? initialData.code : '';
      addHiddenDiv('cc_variantId', variantId);
      let countryOrigin = initialData ? initialData.countryOrigin : '';
      addHiddenDiv('cc_countryOrigin', countryOrigin);
      let storageConditions = initialData ? initialData.storageConditions : '';
      addHiddenDiv('cc_storageConditions',storageConditions);
      let availabilityText = initialData ? initialData.stock : '';
      availabilityText = availabilityText ? availabilityText.stockLevelStatus : '';
      addHiddenDiv('cc_availabilityText', availabilityText);
      let specificationArr = [];
      let finalSpecArr;
      let specification = document.querySelectorAll('div.css-1xv1pkp div.css-lbe0jv');
      for (let index = 0; index < specification.length; index++) {
        const element = specification[index];
        let field = element.querySelector('div.css-5u3qp4');
        // @ts-ignore
        field = field ? field.innerText : '';
        let vaule = element.querySelector('div.css-v2lwwy');
        // @ts-ignore
        vaule = vaule ? vaule.innerText : '';
        let finalVal = field +' : '+vaule;
        specificationArr.push(finalVal);
      }
     
      if(specificationArr.length >=1){
        finalSpecArr = specificationArr;
        let sepc = "|| "+finalSpecArr.join(' || ');
        addHiddenDiv('cc_specifications', sepc);
      }
      // let mainOffer = initialData ? initialData.mainOffer : '';
      // mainOffer = mainOffer ? mainOffer.price : '';
      // let discount = mainOffer ? mainOffer.discount : '';
      // if(discount.type === "PERCENTAGE"){
      //  let promotion = discount.value+"% DISCOUNT";
      //  addHiddenDiv("cc_promotion", promotion);
      // }
      let brandName = initialData ? initialData.brandName : '';
      addHiddenDiv('cc_brandName', brandName);
      let stringToHTML = function (str) {
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
      };
      let marketingText = initialData ? initialData.marketingText : '';
      console.log('marketingText: ', marketingText);
      let description = marketingText ? stringToHTML(marketingText) : '';
      // @ts-ignore
      let description2 = description ? description.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      // @ts-ignore
      addHiddenDiv('cc_description', description2);
      let numberOfReviews = initialData ? initialData.numberOfReviews : '';
      addHiddenDiv('cc_numberOfReviews', numberOfReviews);
      let averageRating = initialData ? initialData.averageRating : '';
      addHiddenDiv('cc_averageRating', averageRating.toFixed(1));
    });
    return await context.extract(productDetails, { transform });
  },
};
