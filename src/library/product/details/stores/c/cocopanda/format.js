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
      var skuText=''; var bText='';var nText='';
      for (let row of group) {
        if(row.videos){
          //console.log('comming to row.videos');
          var info=[];
          row.videos.forEach(item=>{
            let vURL="https://youtu.be/"+item.text;
            //console.log('vURL : ',vURL);
            info.push(vURL);
            //console.log('vList : ',info);
          });
          row.videos=[{"text":info.join(" | ")}];
        }
        if(row.descriptionBullets){
          var tot=0;
          row.descriptionBullets.forEach(item=>{
            tot++;
          });
          row.descriptionBullets=[{"text":tot}];
        }
        if(row.brandText){
          row.brandText.forEach(item=>{
            bText=item.text;
          })
        }
        if(row.nameExtended){
          row.nameExtended.forEach(item=>{
            nText=item.text;
          })
        }
        if(row.price){
          row.price.forEach(item => {
            item.text=item.text.slice(0, -2);
          });
        }
        if(row.listPrice){
          row.listPrice.forEach(item => {
            item.text=item.text.replace('Før: ','').slice(0, -2);
          });
        }
        if(row.availabilityText){
          row.availabilityText.forEach(item=>{
            if(item.text=='display: none;'){
              item.text='In Stock';
            }else{
              item.text='Out of Stock';
            }
          })
        }
        if(row.aggregateRating){
          row.aggregateRating.forEach(item => {
            let reviewCountData=item.text.split('-');
            item.text=reviewCountData.pop();
          });
        }
        if(row.ratingCount){
          row.ratingCount.forEach(item => {
            item.text=item.text.replace('(','').replace(')','');
          });
        }
        if(row.variants){
          var info=[];
          row.variants.forEach(item=>{
            info.push(item.text);
          })
          row.variantCount=[{"text":info.length}];
          row.variants=[{"text":info.join(" | ")}];
        }
        if(row.description){
          var info=[];
          row.description.forEach(item=>{
            info.push(item.text);
          })
          row.description=[{"text":info.join(" | ")}];
        }
        if(bText!=''){
          row.nameExtended=[{"text":bText+" - "+nText}];
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };