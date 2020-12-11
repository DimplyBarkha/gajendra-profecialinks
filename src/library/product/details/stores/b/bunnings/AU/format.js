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
          if(row.image){
            row.image.forEach(item=>{
              item.text=item.text.replace('/w=190,h=190/','/w=800,h=800/');
            })
          }
          if(row.alternateImages){
            row.alternateImages.forEach(item=>{
              item.text=item.text.replace('/w=190,h=190/','/w=800,h=800/');
            })
          }
          if(row.price){
            row.price.forEach(item=>{
              item.text=item.text.replace('*','');
            })
          }
          if(row.ratingCount){
            row.ratingCount.forEach(item=>{
              item.text=item.text.replace('(','').replace(')','');
            })
          }
          if(row.specifications){
            let no2=0,inf=[],tmp;
            row.specifications.forEach(item=>{
              if(no2==0){
                tmp=item.text;
                no2=1
              }else if(no2==1){
                tmp=tmp+" : "+item.text;
                inf.push(tmp);tmp='';no2=0;
              }
            })
            row.specifications=[{"text":inf.join(' | ')}];
          }
          if(row.description){
            var descArr = [];
            row.description.forEach(item=>{
                descArr.push(item.text);
            })
            row.description = [{"text":descArr.join(' || ')}];
          }  
          if(row.descriptionBullets){
            var db = 0;
            row.descriptionBullets.forEach(item => {
                db += 1;                
            })  
            row.descriptionBullets = [{"text":db}];            
          }
          if(row.brandLink){
            row.brandLink.forEach(item=>{
              item.text="https://www.bunnings.com.au"+item.text;
            })
          }
          if(row.additionalDescBulletInfo){
            let inf=[];
            row.additionalDescBulletInfo.forEach(item=>{
              inf.push(item.text);
            })
            row.additionalDescBulletInfo=[{"text":"|| "+inf.join(' || ')}];
          }
          if(row.brandText){
            row.brandText.forEach(item => {
              let brandTextObj=JSON.parse(item.text);
              //console.log('brandTextObj : ',brandTextObj);
              let brandTextName=brandTextObj.brand.name;
              //console.log('brandTextName : ',brandTextName);
              item.text=brandTextName;
            })
          }            
        }
    }
    return cleanUp(data);
  };
  module.exports = { transform };