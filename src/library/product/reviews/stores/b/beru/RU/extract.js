const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    filterReviews: null,
    domain: 'beru.ru',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    try {
      await context.evaluate(() => {
        Array.from(document.querySelectorAll('.commentText .b_8lynrUTtGG')).forEach(elm => elm.click());
      });
      const weekDaysMap = {
        понедельник: 'monday',
        вторник: 'tuesday',
        среда: 'wednesday',
        четверг: 'thursday',
        пятница: 'friday',
        суббота: 'saturday',
        воскресенье: 'sunday',
      };

      const monthsMap1 = {
        январь: 'January',
        февраль: 'February',
        март: 'March',
        апрель: 'April',
        май: 'May',
        июнь: 'June',
        июль: 'July',
        август: 'August',
        сентябрь: 'September',
        октябрь: 'October',
        ноябрь: 'November',
        декабрь: 'December',
      };

      const monthsMap2 = {
        января: 'January',
        февраля: 'February',
        марта: 'March',
        апреля: 'April',
        мая: 'May',
        июня: 'June',
        июля: 'July',
        августа: 'August',
        сентября: 'September',
        октября: 'October',
        ноября: 'November',
        декабря: 'December',
      };
      const wordsToReplace = [...Object.keys(monthsMap2), ...Object.keys(monthsMap1), ...Object.keys(weekDaysMap)];
      const wordMap = { ...monthsMap2, ...monthsMap1, ...weekDaysMap };
      Array.from(document.querySelectorAll('.b_I_N6IMOcwb')).forEach(elm => {
        let elmString = elm.innerText;
        wordsToReplace.forEach(elm => {
          elmString = elmString.replace(elm, wordMap[elm]);
        });
        elm.innerText = elmString;
      });
    } catch (err) {
      console.log('Error clicking more text and date formatting.');
    }
    return await context.extract(productReviews, { transform, type: 'MERGE_ROWS' });
  },
};
