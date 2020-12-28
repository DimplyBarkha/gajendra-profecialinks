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
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/(\/fm-thumbnail\/)/g, '/fm-xl/').trim();
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/(\/fm-sm\/)/g, '/fm-xl/').trim();
        });
      }
      if (row.description) {
        let desc = [];
        row.description.forEach(item => {
          if (row.inTheBoxText) {
            row.inTheBoxText.forEach(itemTemp => {
              item.text = item.text.replace(itemTemp.text.trim(),"");
            });
          }
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          desc.push(item.text);
        });
        let bullet_info = [];
        if (row.descriptionBullets) {
          row.descriptionBullets.forEach(item => {
            if (row.inTheBoxText) {
              row.inTheBoxText.forEach(itemTemp => {
                item.text = item.text.replace(itemTemp.text.trim(),"");
              });
            }
            bullet_info.push(item.text);
          });
        }
        if (desc.length) {
          let str = '';
          if (bullet_info.length) {
            str = "|| " + bullet_info.join(" || ");
          }
          row.description = [{ "text": str + " " + desc.join(" | ") }]
        }
      }
      if (row.descriptionBullets) {
        row.descriptionBullets = [{ "text": row.descriptionBullets.length }];
      }
      if (row.specifications) {
        let info = [];
    
        if (row.specification1) {
          row.specification1.forEach(item => {
            if (row.inTheBoxText) {
              row.inTheBoxText.forEach(itemTemp => {
                item.text = item.text.replace(itemTemp.text.trim(),"");
              });
            }
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
          });
        }
        row.specifications.forEach(item => {
          if (row.inTheBoxText) {
            row.inTheBoxText.forEach(itemTemp => {
              item.text = item.text.replace(itemTemp.text.trim(),"");
            });
          }
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.specifications = [{ 'text': info.join(' || '), 'xpath': row.specifications[0].xpath }];
      }
      delete row.specification1;
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var matches = /(\d+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1]
          }
          else {
            item.text = '';
          }
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(/(\s*statt\s*)/g, '').trim();
          item.text = item.text.replace(/–/g, '').trim();
          item.text = item.text.replace(/\’/g, '').trim();
          item.text = item.text.replace(/\./g, ',').trim();
          item.text = item.text.replace(/\,$/g, '').trim();
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/–/g, '').trim();
          item.text = item.text.replace(/\’/g, '').trim();
          item.text = item.text.replace(/\./g, ',').trim();
          item.text = item.text.replace(/\,$/g, '').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('Durchschnittsbewertung', '');
          item.text = item.text.replace('.', ',').trim();
        });
      }
      if (row.variants) {
        var temp_variant_ids = [];
        var temp_variant_infos = [];
        row.variants.forEach(item => {
          var matches = /window.__INITIAL_STATE__\s+=\s*(.*?\})\;/isg.exec(item.text);
          if (matches) {
            var match_data = matches[1].replace(/(undefined)+/g, 'null');
            let j_data = JSON.parse(match_data);
            j_data['product']['data']['variantMatrix'];
            if (j_data['product']['data']['variantMatrix'] && j_data['product']['data']['variantMatrix'].length > 0) {
              j_data['product']['data']['variantMatrix'].forEach(variants_data => {
                let tmp_variations = {};
                tmp_variations["variantUrl"] = [];
                tmp_variations["variant"] = [];
                if (variants_data['variantOption']['code']) {
                  temp_variant_ids.push(variants_data['variantOption']['code']);
                }
                if (variants_data['variantValueCategory']['name']) {
                  temp_variant_infos.push(variants_data['variantValueCategory']['name']);
                }
              });
            }
            else {
              item.text = '';
            }
          } else {
            item.text = '';
          }
        });
        if (temp_variant_ids.length) {
          row.firstVariant = [{ 'text': row.variantId[0].text }];
          row.variantCount = [{ 'text': temp_variant_ids.length }];
          row.variants = [{ 'text': temp_variant_ids.join(' | ') }];
          row.variantInformation = [{ 'text': temp_variant_infos.join(' | ') }];
        }
        else {
          delete row.variants;
        }
      }
      if (row.weightGross) {
        if (!row.weightNet) {
          row.weightNet = row.weightGross;
          delete row.weightGross;
        }
      }
      if (row.inTheBoxText) {
        let info = [];
        row.inTheBoxText.forEach(item => {
            info.push(item.text.trim());
        });
        function removeDuplicates(data)
       {
         return data.filter((value, index) => data.indexOf(value)===index);
       }
       let itm1= removeDuplicates(info);
        if (itm1.length) {
            row.inTheBoxText= [];
            itm1.forEach(item => {
                row.inTheBoxText.push({ 'text': item });
            });
        }
        
    }

   
    }
  }
  return cleanUp(data);
};
module.exports = { transform } 