
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
          row.additionalDescBulletInfo.forEach(item => {
            info.push(item.text.trim());            
          });
          row.descriptionBullets = [{'text': info.length}];
          row.additionalDescBulletInfo = [{'text':'|| ' + info.join(' || '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
        }
        if (row.specifications) {
          var arr_temp = [];
          row.specifications.forEach(item => {
            item.text = item.text.replace(/\n\s*\n/g,':');
            arr_temp.push(item.text);            
          });
          row.specifications = [{'text':'||'+arr_temp.join('||')}];
        }
        if (row.alternateImages) {
            row.largeImageCount = [{'text':row.alternateImages.length}];            
            var arr_temp = [];
            row.alternateImages = row.alternateImages.slice(1,)
        }        
        if (row.gtin) {
            row.gtin.forEach(item => {
                //"gtin13":"5050996038469\"
                var myRegexp = /\"gtin13\"\s*:\s*\"(.+?)\"/g;
                var match = myRegexp.exec(item.text);
                if (match.length) {
                    item.text = match[1].trim();
                } else {
                    delete row.gtin;
                }                
            });
        }
      }
    }
    return cleanUp(data);
  };  
  module.exports = { transform };
  