
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    transform: null,
    domain: 'lookfantastic.com',
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
        const originalDiv = document.querySelectorAll('ul[class="productVariations_colorList"] li button')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      try {
        var len = document.querySelectorAll('ul[class="productVariations_colorList"] li').length
        var ids=[];
          var urls=[];
        for (let i = 0; i < len; i++) {
          // @ts-ignore
          var id = document.querySelectorAll('ul[class="productVariations_colorList"] li button')[i].click()
          await new Promise(r => setTimeout(r, 3000));
          let variantId1 = document.querySelector('div.productVariations div').getAttribute('data-child-id')
          //addHiddenDiv("variantId", variantId1, i)
          ids.push(variantId1);
          let url=document.querySelector('link[rel="canonical"]').getAttribute('href');
          urls.push(url+"?variation="+variantId1) 
        }
        for(let i=0;i<ids.length;i++)
        {
          addHiddenDiv("variantId", ids[i], i);
          addHiddenDiv("variantUrl",urls[i],i)
        }
        //console.log(ids);
        //console.log(urls);
      } catch (error) {

      }
    });
    return await context.extract(variants, { transform });
  }


