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
      if(row.alternateImages){
        row.alternateImages.forEach(item=>{
          item.text=item.text.replace('-list.','-zoom.');
        })
      }
      if(row.descriptionBullets){
        let inf=[];
        row.descriptionBullets.forEach(item=>{
          inf.push(item.text);
        })
        row.descriptionBullets=[{"text":inf.join(' | ')}];
      }
      if(row.sku){
        let variantIdStr;
        row.sku.forEach(item=>{
          let tmp=item.text.split('event:"viewItem",tms:"gtm",item:"');
          item.text=tmp[1].replace('"});','');
          variantIdStr=item.text;
        })
        row.variantId=[{"text":variantIdStr}];
      }
      if(row.specifications){
        let no2=0,inf=[],tmp='';
        row.specifications.forEach(item=>{
          if(no2==0){
            tmp=item.text;
            no2=1
          }else if(no2==1){
            tmp=tmp+" : "+item.text;
            inf.push(tmp);
            tmp='';no2=0;
          }
        })
        row.specifications=[{"text":inf.join(' || ')}];
      }
      if(row.additionalDescBulletInfo){
        let inf=[];
        row.additionalDescBulletInfo.forEach(item=>{
          inf.push(item.text);
        })
        row.additionalDescBulletInfo=[{"text":inf.join(' || ')}];
      }
      row.rank = [{ "text": rank }];
      row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  return cleanUp(data);
};
module.exports = { transform };