
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
        if (row.additionalDescBulletInfo) {
          let info = [];          
          row.descriptionBullets = [{'text': row.additionalDescBulletInfo.length}];
          row.additionalDescBulletInfo.forEach(item => {
            info.push(item.text.trim());            
          });          
          row.additionalDescBulletInfo = [{'text':'|| ' + info.join(' || '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
        }            
        if (row.alternateImages) {
            //row.alternateImages.splice(0,1);            
            //row.secondaryImageTotal = [{'text':row.alternateImages.length}]
            let info = [];            
            row.alternateImages.forEach(item => {
                item.text.replace('background-image: url(\"','');
                item.text.replace('/\?&.+/','');                
                info.push({'text':item.text});
            });
            row.alternateImages = info;
        }        
        if (row.category) {
            row.category.splice(0,1);            
        }
        if (row.descriptionBullets) {            
            row.descriptionBullets = [{'text':row.descriptionBullets.length}]
        }        
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  