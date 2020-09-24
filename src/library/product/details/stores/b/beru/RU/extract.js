const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform: transform,
    domain: 'beru.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    context.setCookie(
      {
        name: 'gdpr',
        value: '0',
      },
      {
        name: '_ym_d',
        value: '1600499765',
      },
      {
        name: '_ym_uid',
        value: '1600456657557092251',
      },
      {
        name: '_ym_isad',
        value: '1',
      },
      {
        name: 'mda',
        value: '1',
      },
      {
        name: 'Cookie_check',
        value: 'checked',
      },
      {
        name: 'yandexuid',
        value: '4130961191600504515',
      },
      {
        name: 'yuidss',
        value: '4130961191600504515',
      },
      {
        name: 'skid',
        value: '9021723431600504515',
      },
      {
        name: 'visits',
        value: '1600504515-1600504515-1600504515',
      },
      {
        name: 'reviews-merge',
        value: 'true',
      },
      {
        name: 'js',
        value: '1',
      },
      {
        name: 'available-delivery',
        value: '213%3D1',
      },
      {
        name: 'muid',
        value: '1152921504984595815%3A4NeHeaNYTl%2BBlMdbbKd4%2FUbNfBvPSXfw',
      },
      {
        name: 'ymp-soon-popup-was-shown',
        value: 'true',
      },
      {
        name: 'fonts-loaded',
        value: '1',
      },
      {
        name: 'font-balloon-loaded',
        value: '1',
      },
      {
        name: 'ys',
        value: 'c_chck.2548193081',
      },
      {
        name: 'mda2_beacon',
        value: '1600504518258',
      },
      {
        name: 'sso_status',
        value: 'sso.passport.yandex.ru:synchronized',
      },
      {
        name: 'prev-query',
        value: '',
      },
      {
        name: '_ym_visorc_10630330',
        value: 'b',
      },
      {
        name: 'spravka',
        value: 'dD0xNjAwNTA0Njc0O2k9MTU3LjExOS4yMDQuMTYyO3U9MTYwMDUwNDY3NDgwMTE0NzA5MTtoPTk3NmJjNjA5N2U3NWRjNTBlNzc1NjE4OGUzZGRmZTlm',
      },
      {
        name: 'Filter_cookie-shown',
        value: '1',
      },
      {
        name: 'last-loaded-page-id',
        value: 'blue-market%3Aproduct',
      },
      {
        name: 'parent_reqid_seq',
        value: '1600504515130%2Fb0af90a8071ac0e3bff4157fa6af0500%2C1600504674969%2Fbc033c34026cd30dfce59c88a6af0500%2C1600504678849%2F73b8f875a88b443c631cd888a6af0500%2C1600504711405%2F8da27641e5159d743cdfc88aa6af0500',
      },
    );
    return await context.extract(data, { transform });
  },
};