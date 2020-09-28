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
    var totVariantCount = 0;
    for (let row of group) {
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https://www.mediaexpert.pl' + item.text;
        });
      }
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent.forEach(item => {
          item.text = 'https://www.mediaexpert.pl' + item.text;
        });
      }
      if (row.alternateImages) {
        var mainImgArr = [];
        var tot = 0;
        row.alternateImages.forEach(item => {
          if (tot > 0) {
            var tmp = item.text.split(',');
            var tmp1 = tmp[0].split(':');
            var tmp2 = tmp1[1].substring(2, tmp1[1].length - 1);
            var tmp3 = { "text": 'https://www.mediaexpert.pl' + tmp2, "xpath": item.xpath };
            mainImgArr.push(tmp3);
          }
          tot++;
        });
        row.alternateImages = mainImgArr;
      }
      if (row.gtin) {
        var isgtin=0;
        row.gtin.forEach(item => {
          var tmp = item.text.split('"gtin13": ');
          if(tmp.length>1){
            isgtin=1;
            var tmp1 = tmp[1].split(',');
            item.text = tmp1[0].substring(1, tmp1[0].length - 1);
          }
        });
        if(isgtin==0){
          delete row.gtin;
        }
      }
      if (row.variants) {
        var variantsArr = [];
        row.variants.forEach(item => {
          variantsArr.push(item.text);
        });
        row.firstVariant = [{ "text": variantsArr[0], "xpath": row.firstVariant[0]['xpath'] }];
        row.variants = [{ "text": variantsArr.join(' | '), "xpath": row.variants[0]["xpath"] }];
        row.variantCount = [{ "text": variantsArr.length, "xpath": row.firstVariant[0]['xpath'] }];
      }
      if (row.variantInformation) {
        var variantsArrInf = [];
        row.variantInformation.forEach(item => {
          variantsArrInf.push(item.text);
        });
        row.variantInformation = [{ "text": variantsArrInf[0], "xpath": row.variantInformation[0]["xpath"] }];
      }
      if (row.category) {
        var arr = [];
        row.category.forEach(item => {
          arr.push({ text: item.text, xpath: item.xpath });
        });
        arr.shift();
        arr.pop();
        row.category = arr;
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          var tmp = item.text.split('/');
          item.text = tmp[0].replace('.',',');
        });
      }
      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          var myRegexp = /producenta\/importera\s+\n(.+?)\s*\n/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            item.text = "";
          }
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          var myRegexp = /producenta\/importera\s+\n(.+?)\s*\n/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            item.text = "";
          }
        });
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          var myRegexp = /Gwarancja\s+\n\s*(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            item.text = "";
          }
        });
      }
      if (row.specifications) {
        var tdCLose = 1;
        var spec = '';
        var specifyData = [];
        row.specifications.forEach(item => {
          if (tdCLose == 1) {
            spec = item.text;
            tdCLose++;
          } else if (tdCLose == 2) {
            spec = spec + ' : ' + item.text;
            tdCLose = 1;
            specifyData.push(spec);
          }
        });
        row.specifications = [{ "text": specifyData.join(' || '), "xpath": row.specifications[0]['xpath'] }];
      }
      if (row.color) {
        row.color.forEach(item => {
          var data1Arr = item.text.split('Kolor ');
          if (data1Arr.length > 1) {
            var data2Arr = data1Arr[1].trim().split(' ');
            if (data2Arr.length > 1) {
              item.text = data2Arr[0];
            } else {
              item.text = "";
            }
          } else {
            item.text = "";
          }
        });
      }
      if (row.description) {
        var descriptionArr = [];
        row.description.forEach(item => {
          descriptionArr.push(item.text);
        });
        row.description = [{ "text": "|| " + descriptionArr.join(' || '), "xpath": row.description[0]['xpath'] }];
      }
      if(row.manufacturerDescription){
        var manufacturerDescriptionArr = [];
        row.manufacturerDescription.forEach(item=>{
          manufacturerDescriptionArr.push(item.text);
        });
        row.manufacturerDescription = [{ "text": "| " + manufacturerDescriptionArr.join(' | '), "xpath": row.description[0]['xpath'] }];
      }
      if (row.productOtherInformation) {
        row.productOtherInformation.forEach(item => {
          var data1Arr = item.text.split('Informacje dodatkowe ');
          if (data1Arr.length > 1) {
            var data2Arr = data1Arr[1].split('Moc [W]');
            if (data2Arr.length > 1) {
              item.text = data2Arr[0];
            } else {
              item.text = "";
            }
          } else {
            item.text = "";
          }
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };