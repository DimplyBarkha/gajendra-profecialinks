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
    for (let row of group) {     
      let brandTextStr='',gtinStr='',descriptionData='';
      if(row.description){
        row.description.forEach(item=>{
          let descriptionObj=JSON.parse(item.text);
          console.log('descriptionObj :',descriptionObj);
          if(descriptionObj.hasOwnProperty('description')){
            item.text=descriptionObj.description;
          }else{
            item.text="";
          }
          if(descriptionObj.hasOwnProperty('brand')){
            brandTextStr=descriptionObj.brand.name;
          }  
          if(descriptionObj.hasOwnProperty('gtin13')){
            gtinStr=descriptionObj.gtin13;
          }
        })
      }
      if(row.brandText){
        row.brandText.forEach(item=>{
          item.text=brandTextStr;
        })
      }
      if(row.descriptionBullets){
        let inf=[];
        row.descriptionBullets.forEach(item=>{
          inf.push(item.text);
        })
        row.descriptionBullets=[{"text":inf.length}];
      }
      if(row.gtin){
        if(gtinStr!=''){
          row.gtin=[{"text":gtinStr}];
        }else{
          row.gtin=[{"text":""}];
        }
      }
      if(row.ratingCount){
        row.ratingCount.forEach(item=>{
          item.text=item.text.replace(' отзывов','').trim();
        })
      }
      if(row.variantCount){
        let inf=[];
        row.variantCount.forEach(item=>{
          inf.push(item.text);
        })
        row.variantCount=[{"text":inf.length}];
      }
      if(row.specifications){
        let no2=0,tmp='',inf=[];
        row.specifications.forEach(item=>{
          if(no2==0){
            tmp=item.text;
            no2=1;
          }else if(no2==1){
            tmp=tmp+" :"+item.text;
            inf.push(tmp);
            tmp='';no2=0;
          }
        })
        row.specifications=[{"text":inf.join(" || ")}];
      }
      if(row.variants){
        let inf=[];
        row.variants.forEach(item=>{
          let url=item.text.split('/').slice(-2).reverse().pop();
          inf.push(url.replace('p',''));
        })
        row.variants=[{"text":inf.join(' | ')}];
      }
      if(row.variantInformation){
        row.variantInformation.forEach(item=>{
          item.text=item.text.replace(': ','');
        })
      } 
    }
  }
  return cleanUp(data);
};
module.exports = { transform };