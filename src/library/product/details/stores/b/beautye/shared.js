
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/['"]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.sku) {
        row.sku.forEach(item => {
          if(item.text.indexOf("conf_") !== -1){
            item.text = item.text.replace(/conf_/, '');
            //row.variantId[0].text = item.text;
          }
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item=> {
          if(item.text.indexOf("conf_") !== -1){
            item.text = item.text.replace(/conf_/, '');
            //row.variantId[0].text = item.text;
          }});
        
        if(row.variantId.length>1){
        //remove duplicate from array
        let a=row.variantId[1].text;
        row.variantId = [
          {
             text:a,
          },
        ];}
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      let brand = '';
      /*if (row.brandText) {
        if (row.brandText.length > 1) {
          row.brandText = row.brandText.slice(0);
          brand = row.brandText[0].text;
        } else {
          const arr = row.brandText[0].text.split('/');
          let text = arr[arr.length - 1];
          const idx = text.indexOf('@');
          if (idx > -1) {
            text = text.substring(0, idx);
          }
          text = text.split('-').join(' ');
          brand = text;
          row.brandText = [{text: text } ];
        }
      }*/

      if (row.nameExtended) {
        let text=brand;
        row.nameExtended.forEach(item => {
          text += item.text+' '; 
        });   
        if (row.brandText && row.brandText.length){
<<<<<<< HEAD
        let finalName=(row.brandText[0])?(row.brandText[0].text+' '+text):text;
        row.nameExtended = [{text: finalName.trim()}];}
=======
          let finalName=(row.brandText[0].text)?(row.brandText[0].text+' '+text):text;
          row.nameExtended = [{text: finalName.trim()} ];
        }
        
>>>>>>> 7b972930afbf826d54527ee34a985e48cd2a8971
      }

      if (row.variants) {
        const descs = [];
        let newTxt = '';
        let cnt = 0;
        row.variants.forEach(item => {
          descs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          if (cnt > 0) newTxt = newTxt + '| ' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        descs.forEach(item => {
          item.text = newTxt;
        });
        row.variants = descs;
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if(row.alternateImages) {
        const imgs = row.image && row.image[0].text.split("/");
        console.log("imgs:: ", imgs);
        let url = "";
        row.alternateImages.forEach(item => {
          const altArr =  item.text.split("/");
          console.log("arr:: ", altArr);
          altArr[8] = imgs[8];
          console.log("arr afterr:: ", altArr);
          url = altArr.join("/");
          item.text = url;
        });

      }
      
    }
  }
  return data;
};

module.exports = { transform };
