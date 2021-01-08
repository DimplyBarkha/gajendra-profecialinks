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
        let brand = '';
        if (row.image) {            
          row.image.forEach(item => {              
              item.text = item.text.replace(/\?\$.+/g, '');
              item.text = item.text + "?$690$&wid=690&hei=690";
          });          
        }
        if (row.alternateImages) {            
          let info = [];
          row.alternateImages.forEach(item => {
            item.text = item.text.replace(/\?\$.+/g, '');
            item.text = item.text + "?$690$&wid=690&hei=690";
            info.push("1");
          });
          delete row.alternateImages2;
          row.secondaryImageTotal = [{'text':info.length,'xpath':row.alternateImages[0].xpath}];
        }
        if (!row.alternateImages && row.alternateImages2) {                        
          let info = [];
          row.alternateImages2.forEach(item => {
            item.text = item.text.replace(/\?\$.+/g, '');
            item.text = item.text + "?$690$&wid=690&hei=690";
            row.alternateImages.push({'text':item.text,'xpath':row.alternateImages2[0].xpath});
            info.push("1");
          });
          row.secondaryImageTotal = [{'text':info.length,'xpath':row.alternateImages[0].xpath}];
          delete row.alternateImages2;            
        }
        if (row.brandText) {            
          row.brandText.forEach(item => {
              brand = item.text;                
          });          
        }
        if (row.nameExtended) {            
          row.nameExtended.forEach(item => {
              if (brand != ''){
                  item.text = brand + " - " + item.text;
              }
          });          
        }
        if (row.descriptionBullets) {
          let info = [];          
          row.descriptionBullets.forEach(item => {
            info.push(item.text);
          });
          if (info.length){
            row.descriptionBullets = [{'text':info.length,'xpath':row.descriptionBullets[0].xpath}];          
          }
          else{
            delete row.descriptionBullets;
          }
        }
        if (row.listPrice) {
          row.listPrice.forEach(item => {
            item.text = item.text.replace(/(\s*was\s*)+/isg, '').trim();
          });
        }        
        if (row.availabilityText) {          
          row.availabilityText.forEach(item => {
            if (item.text == 'Out of Stock'){
              delete row.quantity;
            }
          });
        }
        if (row.variantId) {          
          row.variantId.forEach(item => {
              var matches = /.+\/(\d+)/isg.exec(item.text);
              if (matches){
                  item.text = matches[1];
              }
              else{
                delete row.variantId;
              }
          });
        }          
        if (row.videos) {
          let info = [];          
          row.videos.forEach(item => {                
              var matches = /.*\/(\d+)\/thumbnail\//isg.exec(item.text);
              if (matches){
                  item.text = "https://video.bedbathandbeyond.com/tvpembed/" + matches[1] + "?autoplay=1&autonext=0";
              }                
          });
          
        }
        if (row.specifications) {
          let info = [];          
          row.specifications.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
          });          
          row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
        }
        let ad_dec_data = '';
        // if(row.additionalDescBulletInfo){
        //   let arr_info = [];
        //   row.additionalDescBulletInfo.forEach(item=>{
        //     arr_info.push(item.text);
        //   });            
        //   row.additionalDescBulletInfo = [{'text':'|| '+arr_info.join(' || ')}];
        //   ad_dec_data = '|| '+arr_info.join(' || ');
        // }
        if (row.additionalDescBulletInfo) {
          let info = [];
          row.additionalDescBulletInfo.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' || ').trim());
          });
          row.additionalDescBulletInfo = [{'text':info.join(' || '),'xpath':row.additionalDescBulletInfo[0].xpath}];
        }
        if (row.description) {
          let info = [];          
          row.description.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
          });
          row.description = [{'text':info.join(' | ') + ad_dec_data,'xpath':row.description[0].xpath}];            
        }
        if(row.variantInformation){
          let arr_info = [];
          row.variantInformation.forEach(item=>{
            arr_info.push(item.text);
          });            
          row.variantInformation = [{'text':arr_info.join(' | ')}];
        }
        if (row.manufacturerDescription) {
          let info = [];          
          row.manufacturerDescription.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
          });
          row.manufacturerDescription = [{'text':info.join(' '),'xpath':row.manufacturerDescription[0].xpath}];            
        }
        if (row.category) {        
          row.category.forEach(item => {
            if (item.text == "Team Spirit") {
              item.text = "";
            }else{
              item.text = item.text;
            }
          });            
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };