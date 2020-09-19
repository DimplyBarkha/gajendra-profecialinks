/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (let row of group) {
      if (row.sku) {
        row.sku.forEach(item => {
          var myRegexp = /.+\/(.+?)_.+/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            delete row.sku;
          }
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          var myRegexp = /.+\/(.+?)_.+/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            delete row.variantId;
          }
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          var brandText='';
          row.brandText.forEach(item => {
            brandText=item.text;
          });
          item.text = brandText+' - '+item.text;
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          var matches = /\s*(\d+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1]
          }
        });
      }
      if (row.specifications) {
        let info = [];
        row.specifications.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.specifications = [{ 'text': info.join(' || '), 'xpath': row.specifications[0].xpath }];
      }
      if(row.additionalDescBulletInfo){
        var additionalDescBulletInfoStr='';
        var oldXpath='';
        row.additionalDescBulletInfo.forEach(item => {
          oldXpath=item.xpath;
          if(additionalDescBulletInfoStr==''){
            additionalDescBulletInfoStr=item.text
          }else{
            additionalDescBulletInfoStr=additionalDescBulletInfoStr+' | '+item.text
          }
        });
        row.additionalDescBulletInfo=[{text:additionalDescBulletInfoStr,xpath:oldXpath}];
      }
      if(row.mpc){
        row.mpc.forEach(item => {
          item.text=item.text.replace('Model Number: ','');
        });
      }
      if (row.alternateImages) {
        if (row.alternateImages.length > 1){
          row.alternateImages.splice(0,1);
        }else{
          delete row.alternateImages;
        }
      }      
    }
  }
  return data;
};

module.exports = { transform };