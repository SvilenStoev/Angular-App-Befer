// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  application: {
    name: 'Befer Application',
    hostname: "https://parseapi.back4app.com",
    apiConfigHeaders: {
      "X-Parse-Application-Id": "7GJqF8la5Gzzpm7o4rAo5A0FeuTytgkwM3FK9iVP",
      "X-Parse-REST-API-Key": "aMFFjTTsnCQrPPAZaK2FYHltL06o6bxQOC8Uk0wt"
    }
  },
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
