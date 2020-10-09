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
          row.image.forEach(item => {
            item.text='https:'+item.text;
          });
        }
        if(row.alternateImages){
          row.alternateImages.forEach(item => {
            item.text='https:'+item.text;
          });
        }
        if(row.descriptionBullets){
            var tmp=[];
            row.descriptionBullets.forEach(item => {
                tmp.push(item.text);
            });
            row.descriptionBullets=[{"text":row.descriptionBullets.length,"xpath":row.descriptionBullets[0]["xpath"]}];
            row.additionalDescBulletInfo=[{"text":"|| "+tmp.join(' || '),"xpath":row.descriptionBullets[0]["xpath"]}];
        }
        if(row.specifications){
            var tmp=[];
            row.specifications.forEach(item=>{
                tmp.push(item.text);
            });
            row.specifications=[{"text":tmp.join(' || '),"xpath":row.specifications[0]["xpath"]}];   
        }
        
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };