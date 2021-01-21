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

      if (row.unInterruptedPDP && row.productBrand) {
        let brand = '';
        row.unInterruptedPDP.forEach((item, index) => {
          if (row.productBrand[index]) {
            brand = (row.productBrand[index].text) ? row.productBrand[index].text : '';
            item.text = brand + ' ' + item.text.replace(/(\/fm-sm\/)/g, '/fm-xl/').trim();
          }
        });
      }

      if (row.description) {
        const desc = [];
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          desc.push(item.text);
        });
        const bulletInfo = [];
        if (row.descriptionBullets) {
          row.descriptionBullets.forEach(item => {
            bulletInfo.push(item.text);
          });
        }
        if (desc.length) {
          let str = '';
          if (bulletInfo.length) {
            str = '|| ' + bulletInfo.join(' || ');
          }
          row.description = [{ text: str + ' ' + desc.join(' | ') }];
        }
      }
      if (row.descriptionBullets) {
        row.descriptionBullets = [{ text: row.descriptionBullets.length }];
      }
      if (row.specifications) {
        const info = [];
        if (row.specification1) {
          row.specification1.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
          });
        }
        row.specifications.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.specifications = [{ text: info.join(' || '), xpath: row.specifications[0].xpath }];
      }
      delete row.specification1;
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var matches = /(\d+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1];
          } else {
            item.text = '';
          }
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(/(\s*statt\s*)/g, '').trim();
          item.text = item.text.replace(/–/g, '').trim();
          item.text = item.text.replace(/’/g, '').trim();
          item.text = item.text.replace(/\./g, ',').trim();
          item.text = item.text.replace(/,$/g, '').trim();
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/–/g, '').trim();
          item.text = item.text.replace(/’/g, '').trim();
          item.text = item.text.replace(/\./g, ',').trim();
          item.text = item.text.replace(/,$/g, '').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('Durchschnittsbewertung', '');
          item.text = item.text.replace('.', ',').trim();
        });
      }
      if (row.variants) {
        var tempVariantIds = [];
        var tempVariantInfos = [];
        row.variants.forEach(item => {
          var matches = /window.__INITIAL_STATE__\s+=\s*(.*?\});/isg.exec(item.text);
          if (matches) {
            var matchData = matches[1].replace(/(undefined)+/g, 'null');
            const jData = JSON.parse(matchData);
            // jData.product.data.variantMatrix;
            if (jData.product.data.variantMatrix && jData.product.data.variantMatrix.length > 0) {
              jData.product.data.variantMatrix.forEach(variantsData => {
                const tmpVariations = {};
                tmpVariations.variantUrl = [];
                tmpVariations.variant = [];
                if (variantsData.variantOption.code) {
                  tempVariantIds.push(variantsData.variantOption.code);
                }
                if (variantsData.variantValueCategory.name) {
                  tempVariantInfos.push(variantsData.variantValueCategory.name);
                }
              });
            } else {
              item.text = '';
            }
          } else {
            item.text = '';
          }
        });
        if (tempVariantIds.length) {
          row.firstVariant = [{ text: row.variantId[0].text }];
          row.variantCount = [{ text: tempVariantIds.length }];
          row.variants = [{ text: tempVariantIds.join(' | ') }];
          row.variantInformation = [{ text: tempVariantInfos.join(' | ') }];
        } else {
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
        const arrInTheBox = [];
        row.inTheBoxText.forEach(item => {
          arrInTheBox.push(item.text);
        });
        const arrUniqueText = [...new Set(arrInTheBox)];
        row.inTheBoxText = [
          { text: arrUniqueText.toString().replace(/,/g, '||').replace(/und\b/g, '||') },
        ];
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
