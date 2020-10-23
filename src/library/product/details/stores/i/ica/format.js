/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {  
    const cleanUp = (data, context) => {
      const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }))));
      return data;
    };
    for (const { group } of data) {
      var rank = 1;
      for (let row of group) {
        var variantIdsku=''; var brandTextData=''; var nameExtendedData='';
        if(row.image){
          var imgSrc=''; 
          row.image.forEach(item => {
            var tmp=item.text.split(' ');
            item.text=imgSrc=tmp[1];
          });
          var imgSrcVar=imgSrc.split('/');
          var imgSrcVar1=imgSrcVar.pop().split('.');
          variantIdsku=imgSrcVar1[0];
        }
        if(row.pricePerUnitUom){
          row.pricePerUnitUom.forEach(item => {
            let var1=item.text.split('kr/');
            let var2=var1[1].split(' ');
            item.text=var2[0];
          });
        }
        if(row.price){
          row.price.forEach(item=>{
            item.text=item.text.replace(',','.');
          })
        }
        if(row.termsAndConditions){
          row.termsAndConditions.forEach(item => {
            if(item.text!=''){
              item.text='Yes';
            }else{
              item.text='No';
            }
          });
        }
        if(row.brandText){
          row.brandText.forEach(item => {
            brandTextData=item.text;
          });
        }
        if(row.nameExtended){
          row.nameExtended.forEach(item=>{
            nameExtendedData=item.text;
          });
        }
        if(brandTextData!=''){
          row.nameExtended=[{"text":brandTextData+' '+nameExtendedData}];
        }
        if(row.totalFatPerServing){
          row.totalFatPerServing.forEach(item=>{
            var totalFatmatch = /Fett\s+([\d|\.]+)\s+g/.exec(item.text);
            //console.log('totalFatmatch :',totalFatmatch);
            if(totalFatmatch!=null){
              if(totalFatmatch.length){
                row.totalFatPerServing = [{"text":totalFatmatch[1].trim()}];
                row.totalFatPerServingUom=[{"text":'g'}];
              }else{
                row.totalFatPerServing = [{"text":''}];
                row.totalFatPerServingUom=[{"text":''}];
              }
            }else{
              row.totalFatPerServing = [{"text":''}];
              row.totalFatPerServingUom=[{"text":''}];
            }
            var saturatedFatPerServingmatch = /Varav mättat fett\s+([\d|\.]+)\s+g/.exec(item.text);
            if(saturatedFatPerServingmatch!=null){
              if(saturatedFatPerServingmatch.length){
                row.saturatedFatPerServing = [{"text":saturatedFatPerServingmatch[1].trim()}];
                row.saturatedFatPerServingUom=[{"text":'g'}];
              }else{
                row.saturatedFatPerServing = [{"text":""}];
                row.saturatedFatPerServingUom=[{"text":''}];
              }
            }else{
              row.saturatedFatPerServing = [{"text":""}];
              row.saturatedFatPerServingUom=[{"text":''}];
            }
            var sodiumPerServingmatch = /Salt\s+([\d|\.]+)\s+g/.exec(item.text);
            if(sodiumPerServingmatch!=null){
              if(sodiumPerServingmatch.length){
                row.sodiumPerServing = [{"text":sodiumPerServingmatch[1].trim()}];
                row.sodiumPerServingUom=[{"text":'g'}];
              }else{
                row.sodiumPerServing = [{"text":""}];
                row.sodiumPerServingUom=[{"text":''}];
              }
            }else{
              row.sodiumPerServing = [{"text":""}];
              row.sodiumPerServingUom=[{"text":''}];
            }
            var totalCarbPerServingmatch = /Kolhydrater\s+([\d|\.]+)\s+g/.exec(item.text);
            if(totalCarbPerServingmatch!=null){
              if(totalCarbPerServingmatch.length){
                row.totalCarbPerServing = [{"text":totalCarbPerServingmatch[1].trim()}];
                row.totalCarbPerServingUom=[{"text":'g'}];
              }else{
                row.totalCarbPerServing = [{"text":""}];
                row.totalCarbPerServingUom=[{"text":''}];
              }
            }else{
              row.totalCarbPerServing = [{"text":""}];
              row.totalCarbPerServingUom=[{"text":''}];
            }
            var dietaryFibrePerServingmatch = /Fiber\s+([\d|\.]+)\s+g/.exec(item.text);
            if(dietaryFibrePerServingmatch!=null){
              if(dietaryFibrePerServingmatch.length){
                row.dietaryFibrePerServing = [{"text":dietaryFibrePerServingmatch[1].trim()}];
                row.dietaryFibrePerServingUom=[{"text":'g'}];
              }else{
                row.dietaryFibrePerServing = [{"text":""}];
                row.dietaryFibrePerServingUom=[{"text":''}];
              }
            }else{
              row.dietaryFibrePerServing = [{"text":""}];
              row.dietaryFibrePerServingUom=[{"text":''}];
            }
            var proteinPerServingmatch = /Protein\s+([\d|\.]+)\s+g/.exec(item.text);
            if(proteinPerServingmatch!=null){
              if(proteinPerServingmatch.length){
                row.proteinPerServing = [{"text":proteinPerServingmatch[1].trim()}];
                row.dietaryFibrePerServingUom=[{"text":'g'}];
              }else{
                row.proteinPerServing = [{"text":""}];
                row.dietaryFibrePerServingUom=[{"text":''}];
              }
            }else{
              row.proteinPerServing = [{"text":""}];
              row.dietaryFibrePerServingUom=[{"text":''}];
            }
          })
        }
        if(row.availabilityText){
          row.availabilityText.forEach(item=>{
            if(item.text!=''){
              item.text='Out of Stock';
            }
          });
        }
        row.variantId=[{"text":variantIdsku}];
        row.sku=[{"text":variantIdsku}];
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };