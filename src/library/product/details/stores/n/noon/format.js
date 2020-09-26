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
      if (row.firstVariant) {
        row.firstVariant.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }
      if (row.alternateImages) {
        var  img_arr = [];
        var count = 0;
        row.alternateImages.forEach(item => {          
          img_arr.push({"text": item.text});          
          count = count + 1
        });
        if (img_arr.length > 1){
          img_arr.splice(0,1);
          row.alternateImages = img_arr;
        }else{
          delete row.alternateImages;
        }
      }      
      if (row.description) {
        var temp_text = '';
        row.description.forEach(item => {
          temp_text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
        temp_text = '|| '+temp_text;
        row.description = [{'text':temp_text}]
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
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
        var count_temp=0;
        var oldXpath='';
        row.additionalDescBulletInfo.forEach(item => {
          oldXpath=item.xpath;
          if(additionalDescBulletInfoStr==''){
            additionalDescBulletInfoStr=item.text
          }else{
            additionalDescBulletInfoStr=additionalDescBulletInfoStr+' | '+item.text
          }
          count_temp = count_temp + 1
        });
        additionalDescBulletInfoStr = '| ' + additionalDescBulletInfoStr
        row.additionalDescBulletInfo=[{text:additionalDescBulletInfoStr,xpath:oldXpath}];
        row.descriptionBullets=[{text:count_temp}];
      }
      if(row.mpc){
        row.mpc.forEach(item => {
          item.text=item.text.replace('Model Number: ','');
        });
      }
      if(row.variantCount){
        var tot=0;
        row.variantCount.forEach(item => {
          tot++;
        });
        row.variantCount=[{text:tot}];
      }
      if(row.variants){
        var arr_info=[];
        row.variants.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
          arr_info.push(item.text)
        });
        row.variants=[{text:arr_info.join(' | ')}];
      }
      if(row.variantInformation){
        var arr_info=[];
        row.variantInformation.forEach(item => {          
          arr_info.push(item.text)
        });
        row.variantInformation=[{text:arr_info.join(' | ')}];
      }
      if(row.nameExtended){
        var temp_brand = ''
        if(row.brandText)(          
          row.nameExtended[0].text = row.brandText[0].text + '-' + row.nameExtended[0].text
        )        
      }
    }
  }
  return data;
};
module.exports = { transform };