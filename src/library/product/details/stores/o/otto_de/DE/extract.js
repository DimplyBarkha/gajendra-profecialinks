
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    transform: null,
    domain: 'otto.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // @ts-ignore
      const URL = window.location.href
      let varidd = ''
      try {
        var rpc = URL.split('/#variationId=')[1]
        addElementToDocument('rpcid', rpc)
        varidd = rpc
      }
      catch (error) {

      }


      try{
        //const rawdata = getXpath("//div[@class='prd_price__main']/span/span[@id='reducedPriceAmount']/@content|//div[@class='prd_price__main']/span/span[@id='normalPriceAmount']/@content|//span[@id='normalPriceAmount']/text()", 'nodeValue');
      var newprc = getXpath("//span[@id='reducedPriceAmount']/text()|//span[@id='normalPriceAmount']/text()", 'nodeValue');

      if (newprc != null) {
        //var nr = newprc.replace('.', ',');
        var price = '€ ' + newprc
        addElementToDocument('price', price);
      }
      }
      catch(error){}


      try{
        const varinf = getAllXpath("//span[@class='prd_selectedValue']/text()", 'nodeValue');

      var nwvarinf = varinf.join('-');
      addElementToDocument('varinf', nwvarinf);
      }
      catch(error){}


      try{
        const img = getXpath('//div[contains(@class,"js_prd_swiper-slide prd_swiper-slide js_prd_zoomWrapper swiper-slide-visible swiper-slide-active")]/a/@href', 'nodeValue');
        var nimg = img
        if (nimg != null) {
          var nwimg = nimg.split('?$')[0]
          //var price = '€' + nr
          addElementToDocument('img', nwimg);
        }

      }
      catch(error){}


      try{

        const brandd = getXpath('//a[@id="brand"]/@data-brand', 'nodeValue');
      const brandd2 = getXpath('//div/h1[@itemprop="name"]/text()', 'nodeValue');
      if (brandd != null) {
        addElementToDocument('brandd', brandd);
      }
      else {
        var newbrandd = brandd2.split(' ')[0]
        addElementToDocument('brandd', newbrandd);
      }

      }
      catch(error){}
      

      
      try{
        // @ts-ignore
      const aa = document.querySelector('section[class="prd_section"] div[class*=\'prd_section\']').innerText
      var bulletz= getAllXpath("//ul[@class='prd_unorderedList']/li/text()", 'nodeValue');
      var newdesc =''
      if (newdesc != null) {
      for (var i=0; i<=bulletz.length; i++){
        newdesc= aa.replace(bulletz[i],bulletz[i]+'||')
      }
      
        // @ts-ignore
        var desc1 = newdesc.replace('Artikelbeschreibung', '')
        addElementToDocument('desc1', desc1);
      }

      }
      catch(error){}

      

      try{
        const rawjson = getXpath("//script[@id='productDataJson']/text()", 'nodeValue');

      var jsondata = JSON.parse(rawjson);
      var sku = jsondata.id;
      var a = jsondata.sortedVariationIds;
      let gtin = jsondata.variations[varidd].ean;


      var variants = a.join(' | ');
      addElementToDocument('sku', sku);
      addElementToDocument('variant', variants);
      addElementToDocument('cts', a.length);
      addElementToDocument('gtin', gtin);
      }
      catch(error){}
      
      
      // var variant = getAllXpath("//div[@class='reco_cinema reco_productlineCinema']/div[@class='reco_cinema__container']/ul/li/@data-variation-id", 'nodeValue');
      // if (variant != null) {
      //   var ab = variant.join(' | ');
      //   addElementToDocument('variant', ab);
      // }
      //     // const perunit = getXpath("//span[@class='prd_price__normAmount']/text()", 'nodeValue');
      //     // if (perunit != null) {
      //     //   var npu = perunit.replace(',', '.')
      //     //   addElementToDocument('perunit', npu);
      //     // }
      try{

        const avail = getXpath("//div[@id='availability']/span/text()", 'nodeValue');
      if (avail != null) {
        if (avail.includes('leider ausverkauft')) {
          var newavail = 'Out Of Stock';
          addElementToDocument('newavail', newavail);
        }
        else {
          var newavail = 'In Stock'
          addElementToDocument('newavail', newavail);
        }
      }
      }
      catch(error){}
      
      


      try{

        const aggr = getXpath("//span[@class='p_rating200']/@content", 'nodeValue');
      if (aggr != null) {
        if (aggr.includes('.')) {
          var newaggr = aggr.replace('.', ',');
          addElementToDocument('aggr', newaggr);
        }
        else {
          var newaggr = aggr
          addElementToDocument('aggr', newaggr);
        }
      }
      }
      catch(error){}
      
      

      const weight = getXpath("(//*[contains(text(),'Gewicht')]//parent::span//parent::td//parent::tr//td[2])[1]/text()", 'nodeValue');
      if (weight != null) {
        try {
          var nweight = weight.replace(',', '.')
          addElementToDocument('nweight', nweight);
        }
        catch (error) {
          addElementToDocument('nweight', weight)
        }
      }
      try{
        var nameext=getXpath("//div[@class='prd_shortInfo__text']/h1/text()", 'nodeValue');
        if (nameext!=null){
          var newnameext = nameext+' -'+nwvarinf;
        addElementToDocument('newnameext', newnameext);
        }
      }
      catch (error){}
      
      

    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
