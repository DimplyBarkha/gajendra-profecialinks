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
        if(row.sku){
            row.sku.forEach(item=>{
                item.text=item.text.replace('ברקוד מוצר:','').trim();
            })
        }
        if(row.mpc){
          row.mpc.forEach(item=>{
              item.text=item.text.replace('ברקוד מוצר:','').trim();
          })
        }
        if(row.nameExtended){
          let inf=[];
          row.nameExtended.forEach(item=>{
              inf.push(item.text);
          })
          row.nameExtended=[{"text":inf[0]+' - '+inf[1]}];
        }
        if(row.aggregateRating){
          row.aggregateRating.forEach(item=>{
              item.text=item.text.replace(' star rating','').trim();
          })
        }
        if(row.specifications){
          let no2=0,inf=[],tmp='';
          row.specifications.forEach(item=>{
            if(no2==0){
              tmp=item.text;
              no2++
            }else if(no2==1){
              tmp=tmp+" : "+item.text;
              inf.push(tmp);
              tmp='';
              no2=0;
            }
          })
          row.specifications=[{"text":inf.join(' | ')}];
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };