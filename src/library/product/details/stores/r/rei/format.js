
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
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https://www.rei.com' + item.text;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://www.rei.com' + item.text.replace('size=120x90','size=512x682');
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = 'https://www.rei.com' + item.text;
        });
      }
      if (row.color) {
        row.color.forEach(item => {
          item.text = item.text.replace(':','').trim();
        });
      }      
      if (row.videos) {
        row.videos.forEach(item => {
          var temp_json = JSON.parse(item.text);
          var json_obj = temp_json['videos'];
          var arr_video = [];
          if(json_obj){
            json_obj.forEach(inner_obj => {
              arr_video.push({"text":inner_obj['articleUrl']});
            });
          }
          if (arr_video.length) {
            row.videos = arr_video;
          }else{
            delete row.videos;
          }
        });
      }
      if (row.variants) {
        row.variants.forEach(item => {
          var temp_json = JSON.parse(item.text);
          var json_obj = temp_json['variants'];
          var variants = [];
          if(json_obj){
            json_obj.forEach(inner_obj => {
              variants.push(inner_obj['sku']);
              var count = 0;
              if(count == 0){
                //row.firstVariant = [{"text":inner_obj['sku']}];
                if(inner_obj['size'] && inner_obj['size'] != 'NONE'){
                  row.variantInformation = [{"text":inner_obj['size']}];
                }
                if(inner_obj['color']['label'] && inner_obj['color']['label'] != 'NONE'){
                  if(row.variantInformation){
                    row.variantInformation = [{"text":  row.variantInformation[0]["text"] + " - " + inner_obj['size']}];
                  }else{
                    row.variantInformation = [{"text": inner_obj['color']['label']}];
                  }
                }                
                if(inner_obj['color']['code']){
                  row.colorCode = [{"text":inner_obj['color']['code']}];
                }
                var upc_arr = inner_obj['identifiers'];
                if(upc_arr){
                  upc_arr.forEach(inner_ar => {
                    if(inner_ar['type'] == "EAN"){
                      row.gtin = [{"text":inner_ar['value']}];
                    }
                  });
                }
                count++;
              }
            });
          }
          // if (variants.length) {
          //   row.variants = [{ 'text': variants.join(' | ') }];
          //   row.variantCount = [{"text":variants.length}];
          // }else{
          //   delete row.variants;
          // }
          delete row.variants;
        });
      }      
      if (row.specifications) {
        var specificationsArr = [];
        row.specifications.forEach(item => {
          specificationsArr.push(item.text.replace(/\n\s\n\s\n/,' : '));
        });
        if(specificationsArr.length){
          row.specifications = [{"text": specificationsArr.join(" || ")}];
        }
      }
      if (row.description) {
        var descriptionArr = [];
        row.description.forEach(item => {
          descriptionArr.push(item.text);
        });
        if(descriptionArr.length){
          row.description = [{"text": "|| " + descriptionArr.join(" || ")}];
          row.descriptionBullets = [{"text": descriptionArr.length}];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
