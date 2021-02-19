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
        if (row.category) {
          let info = [];
          row.category.forEach(item => {
            info.push(item.text.trim());
          });
          if (info.length) {
            row.category = [];
            info.forEach(item => {
              row.category.push({ "text": item});
            });
          }
        }
        if (row.description) {
          let description_ar = [];
          row.description.forEach(item => {
            description_ar.push(item.text);
          });
          if (description_ar.length) {
            row.description = [{ "text": description_ar.join(" "), 'xpath': row.description[0].xpath }];
          }
      }
      if (row.ingredientsList) {
        let info = [];
        row.ingredientsList.forEach(item => {
          info.push(item.text);
        });
        if (info.length) {
          row.ingredientsList = [{ "text": info.join(" "), 'xpath': row.ingredientsList[0].xpath }];
        }
      }
      if (row.sku) {
        let info = [];
        row.sku.forEach(item => {
          item.text = item.text.split("?").pop();
          info.push(item.text);
        });
        if (info.length) {
          row.sku = [{ "text": info.join("").replace('stockcode=',''), 'xpath': row.sku[0].xpath }];
        }
       }
       if (row.variantId) {
        let info = [];
        row.variantId.forEach(item => {
          item.text = item.text.split("?").pop();
          info.push(item.text);
        });
        if (info.length) {
          row.variantId = [{ "text": info.join("").replace('stockcode=',''), 'xpath': row.variantId[0].xpath }];
        }
       }
        if (row.price) {
          row.price.forEach(item => {
              item.text = item.text.replace(/\s*/g, '').trim();
              item.text = item.text.replace('each', '').trim();
          });
      }
      if (row.servingSize) {
        row.servingSize.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text = item.text.split("Servingsize:").pop();
            item.text = item.text.replace('Servingsize:', '').trim();
            item.text = item.text.replace(/[a-z]/g, '').trim();
        });
    }
    if (row.pricePerUnit) {
      row.pricePerUnit.forEach(item => {
          item.text = item.text.replace(/\s*/g, '').trim();
          item.text = item.text.replace(/\/.*/, '').trim();
          item.text = item.text.replace('Cupprice$', '').trim();
      });
  }
  if (row.pricePerUnitUom) {
    row.pricePerUnitUom.forEach(item => {
        item.text = item.text.replace(/\s*/g, '').trim();
        item.text = item.text.split("/").pop();
    });
}
  if (row.numberOfServingsInPackage) {
    row.numberOfServingsInPackage.forEach(item => {
        item.text = item.text.replace(/\s*/g, '').trim();
        item.text = item.text.replace(/Servingsize.*/, '').trim();
    });
}
    if (row.servingSizeUom) {
      row.servingSizeUom.forEach(item => {
          item.text = item.text.replace(/\s*/g, '').trim();
          item.text = item.text.split("Servingsize:").pop();
          item.text = item.text.replace('Servingsize:', '').trim();
          item.text = item.text.replace(/[0-9]/g, '');
          item.text = item.text.replace('.', '');
      });
  }
  if (row.totalFatPerServing) {
    row.totalFatPerServing.forEach(item => {
        item.text = item.text.replace(/\s*/g, '').trim();
        item.text = item.text.replace(/[a-z]/g, '');
    });
}
if (row.totalFatPerServingUom) {
  row.totalFatPerServingUom.forEach(item => {
      item.text = item.text.replace(/\s*/g, '').trim();
      item.text = item.text.replace(/[0-9]/g, '');
      item.text = item.text.replace('.', '');
  });
}
if (row.saturatedFatPerServing) {
  row.saturatedFatPerServing.forEach(item => {
      item.text = item.text.replace(/\s*/g, '').trim();
      item.text = item.text.replace(/[a-z]/g, '');
  });
}
if (row.saturatedFatPerServingUom) {
row.saturatedFatPerServingUom.forEach(item => {
    item.text = item.text.replace(/\s*/g, '').trim();
    item.text = item.text.replace(/[0-9]/g, '');
    item.text = item.text.replace('.', '');
});
}
if (row.sodiumPerServing) {
  row.sodiumPerServing.forEach(item => {
      item.text = item.text.replace(/\s*/g, '').trim();
      item.text = item.text.replace(/[a-z]/g, '');
  });
}
if (row.sodiumPerServingUom) {
row.sodiumPerServingUom.forEach(item => {
    item.text = item.text.replace(/\s*/g, '').trim();
    item.text = item.text.replace(/[0-9]/g, '');
    item.text = item.text.replace('.', '');
});
}
if (row.totalCarbPerServing) {
  row.totalCarbPerServing.forEach(item => {
      item.text = item.text.replace(/\s*/g, '').trim();
      item.text = item.text.replace(/[a-z]/g, '');
  });
}
if (row.totalCarbPerServingUom) {
row.totalCarbPerServingUom.forEach(item => {
    item.text = item.text.replace(/\s*/g, '').trim();
    item.text = item.text.replace(/[0-9]/g, '');
    item.text = item.text.replace('.', '');
});
}
if (row.totalSugarsPerServing) {
  row.totalSugarsPerServing.forEach(item => {
      item.text = item.text.replace(/\s*/g, '').trim();
      item.text = item.text.replace(/[a-z]/g, '');
  });
}
if (row.totalSugarsPerServingUom) {
row.totalSugarsPerServingUom.forEach(item => {
    item.text = item.text.replace(/\s*/g, '').trim();
    item.text = item.text.replace(/[0-9]/g, '');
    item.text = item.text.replace('.', '');
});
}
if (row.proteinPerServing) {
  row.proteinPerServing.forEach(item => {
      item.text = item.text.replace(/\s*/g, '').trim();
      item.text = item.text.replace(/[a-z]/g, '');
  });
}
if (row.proteinPerServingUom) {
row.proteinPerServingUom.forEach(item => {
    item.text = item.text.replace(/\s*/g, '').trim();
    item.text = item.text.replace(/[0-9]/g, '');
    item.text = item.text.replace('.', '');
});
}
      if (row.quantity) {
        row.quantity.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text = item.text.replace('Volumesize', '').trim();
        });
    }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
            item.text = item.text.replace(/\s*/g, '').trim();
            item.text = item.text.replace('Non-club', '').trim();
            item.text = item.text.replace('Was', '').trim();
        });
    }
        if(row.availabilityText){
          row.availabilityText.forEach(item => {
            if (item.text == 'Unavailable'){
              row.availabilityText = [{"text": 'Out of Stock', "xpath": row.availabilityText[0].xpath}]
            }else{
              row.availabilityText = [{"text": 'In Stock', "xpath": row.availabilityText[0].xpath}]
            }
          })
        }
        if (row.name) {
          let info = [];
          row.name.forEach(item => {
            info.push(item.text);
          });
          if (info.length) {
            row.name = [{ "text": info.join(" ").replace('Package type','').replace('Volume size',''), 'xpath': row.name[0].xpath }];
          }
      }
        if (row.nameExtended) {
          let info = [];
          row.nameExtended.forEach(item => {
            info.push(item.text);
          });
          if (info.length) {
            row.nameExtended = [{ "text": info.join(" ").replace('Package type','').replace('Volume size',''), 'xpath': row.nameExtended[0].xpath }];
          }
      }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };