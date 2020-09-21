/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    var totBullet=0;
    for (let row of group) {
      var totBullet=0;
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
          oldXpath=item.xpath; totBullet++;
          if(additionalDescBulletInfoStr==''){
            additionalDescBulletInfoStr=item.text
          }else{
            additionalDescBulletInfoStr=additionalDescBulletInfoStr+' | '+item.text
          }
        });
        additionalDescBulletInfoStr='| '+additionalDescBulletInfoStr;
        row.additionalDescBulletInfo=[{"text":additionalDescBulletInfoStr,xpath:oldXpath}];
      }
      if(row.description){
        var additionalDescBulletInfoArr = [];
        row.description.forEach(item => {
          additionalDescBulletInfoArr.push(item.text);
        });
        if(additionalDescBulletInfoArr.length){
          row.description=[{"text":"|| " + additionalDescBulletInfoArr.join(" || "),"xpath":row.description[0]["xpath"]}];
        }       
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
      if(row.variantCount){
        var tot=0;
        row.variantCount.forEach(item => {
          tot++;
        });
        row.variantCount=[{"text":tot}];
      }
      if(totBullet>0){
        totBullet++;
        row.descriptionBullets=[{"text":totBullet}]
      }
    }
  }
  return data;
};

module.exports = { transform };