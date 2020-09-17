/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }
      if (row.alternateImages) {
        var  img_arr = [];
        row.alternateImages.forEach(item => {
          img_arr.push({"text": item.text});
        });
        if (img_arr.length > 1){
          img_arr.splice(0,1);
          row.alternateImages = img_arr;
        }else{
          delete row.alternateImages;
        }
      }      
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var matches = /\s*(\d+)/isg.exec(item.text);
          if (matches.length) {
            item.text = matches[1];
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
    }
  }
  return data;
};
module.exports = { transform };