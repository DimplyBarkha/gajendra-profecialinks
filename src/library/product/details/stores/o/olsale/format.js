
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
    for (const row of group) {
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').slice();
        });
      }
     if(row.inTheBoxUrl){
        row.inTheBoxUrl.forEach(item => {
           item.text = item.text.replace("https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/products/personal-care/556/overview/Magento-Personalcare-556-OverviewPage-Tech-Featurettes-Magento-Precision-styling7.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&wid=3840", "").slice();
          item.text = item.text.replace("https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/dynamic-media/personal-care/556/technology/Dyson-Corrale-Keyfeatures-Technology-IHC-8.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&wid=3840", "").trim();
          item.text = item.text.replace("https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/dynamic-media/personal-care/556/technology/Dyson-Corrale-Keyfeatures-Technology-4celllithiumbattery-9.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&wid=3840", "").trim();
          item.text = item.text.replace("https://media.olsale.co.il/media/takanon/4324234234.PNG", "").trim();
        });
     }
     if (row.inTheBoxText) {
        row.inTheBoxText.forEach(item => {
          item.text = item.text.replace('מתאים לכל סוגי המשטחים -ניקוי מלא של רצפות, שטיחים ופרקטים ולבתים עם חיות מחמד.', '').trim();
          item.text =  item.text.replace('ובזכות טכנלוגיית AIR MULTIPLIER זרימת האוויר מוכפלת פי 3.','').trim();
          //item.text = item.text.replace('מתאים לכל סוגי המשטחים - ניקוי מלא של רצפות, שטיחים ופרקטים מתאים לבתים עם חיות מחמד מפרט טכני טכנולוגיית ™Tier Radial cyclones 2 עוצמת שאיבה - 115AW נפח המיכל - 0.54 ליטר משקל - 2.61 ק\"ג זמן טעינה - 5 שעות לטעינה מלאה של הסוללה מידות 250 מ\"מ גובה, 1244 מ\"מ אורך, 224 מ\"מ רוחב מצבי עבודה מצב 1 Mode - עד 40 דקות עבודה רציפה ללא אביזר ממונע, עם מברשת מיני ממונעת עד 30 דקות עבודה, עם מברשת ממונעת ראשית עד 25 דקות עבודה. מצב מקסימום Max עד 7 דקות עבודה. אישורי בריאות מאושר ע\"י האגודה הבריטית והאגודה השוויצרית לאלרגיה ב.נ.ז.כ סחר בע\"מ יבואן רשמי').trim();
         // item.text = item.text.replace("מתאים לכל סוגי המשטחים - ניקוי מלא של רצפות, שטיחים ופרקטים מתאים לבתים עם חיות מחמד מפרט טכני טכנולוגיית ™Tier Radial cyclones 2 עוצמת שאיבה - 115AW נפח המיכל - 0.54 ליטר משקל - 2.61 ק\"ג זמן טעינה - 5 שעות לטעינה מלאה של הסוללה מידות 250 מ\"מ גובה, 1244 מ\"מ אורך, 224 מ\"מ רוחב מצבי עבודה מצב 1 Mode - עד 40 דקות עבודה רציפה ללא אביזר ממונע, עם מברשת מיני ממונעת עד 30 דקות עבודה, עם מברשת ממונעת ראשית עד 25 דקות עבודה. מצב מקסימום Max עד 7 דקות עבודה. אישורי בריאות מאושר ע\"י האגודה הבריטית והאגודה השוויצרית לאלרגיה ב.נ.ז.כ סחר בע\"מ יבואן רשמי",'').trim();
         if(item.text.length > 500)
         {
          item.text= "";
         }
        });
      }
      if (row.inTheBoxText) {
          row.inTheBoxText = getUniqueListBy(row.inTheBoxText, 'text')
        }

      if ((!row.inTheBoxText || !row.inTheBoxText.length) && row.inTheBoxText1) {
        console.log('inTheBoxText1',row.inTheBoxText1);
        row.inTheBoxText = row.inTheBoxText1;
        console.log("inTheBoxText", row.inTheBoxText);
      }
    }
    }
function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  return cleanUp(data);
};


module.exports = { transform };
