
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: null,
    domain: 'flaconi.de',
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
  const { variants } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="pdp-row"] ul li a')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
       try {
      var len=document.querySelectorAll('div[class="pdp-row"] ul li a').length
      var ids=[];
       var urls=[];
       for (let i = 0; i < len; i++) {
        var url=document.querySelector("meta[property='og:url']").getAttribute('content')
        var sku=document.querySelectorAll('div[class="pdp-row"] ul li a')[i].getAttribute('data-sku')
        var url1=document.querySelectorAll('div[class="pdp-row"] ul li a')[i].getAttribute('href')
        ids.push(sku);
        urls.push(url+url1)

       }
       for(let i=0;i<ids.length;i++)
      {
        addHiddenDiv("variantId", ids[i], i);
        addHiddenDiv("variantUrl",urls[i],i)
      }
    }
    catch (error) {

    }
  });
  return await context.extract(variants, { transform });
}
;
