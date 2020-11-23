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
          if(row.description){
              let inf=[];
              row.description.forEach(item=>{
                  inf.push(item.text);
              })
              row.description=[{"text":inf.join(' | ')}];
              row.descriptionBullets=[{"text":inf.length}];
          }
            if(row.description){
                let inf=[];
                row.description.forEach(item=>{
                    inf.push(item.text);
                })
                row.description=[{"text":inf.join(' | ')}];
            }
            if(row.sku){
                row.sku.forEach(item=>{
                    item.text=item.text.replace('#','');
                })
            }
            if(row.variantId){
                row.variantId.forEach(item=>{
                    item.text=item.text.replace('#','');
                })
            }
            if(row.ratingCount){
                row.ratingCount.forEach(item=>{
                    item.text=item.text.replace('(','').replace(')','');
                })
            }
            if(row.specifications){
                let row2=0, inf=[], tmp='';
                row.specifications.forEach(item=>{
                    if(row2==0){
                        tmp=item.text;
                        row2++
                    }
                    if(row2==1){
                        tmp=tmp+" : "+item.text;
                        row2=0;
                        inf.push(tmp);
                        tmp='';
                    }
                })
                row.specifications=[{"text":inf.join(' | ')}];
            }
            if(row.additionalDescBulletInfo){
                let inf=[];
                row.additionalDescBulletInfo.forEach(item=>{
                    inf.push(item.text);
                })
                row.additionalDescBulletInfo=[{"text":inf.join(' | ')}];
            }
            if(row.Image360Present){
                row.Image360Present=[{"text":"Yes"}];
            }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };