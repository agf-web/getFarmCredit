// Add this script to any page to display the app
// Add the config script before this script to customize the app

(function () {
  // app.css
  var getFarmStyles = document.createElement('link');
  getFarmStyles.href = 'https://www.getfarmcredit.com/modules/custom/getfarmcreditmap/css/__VAR_STYLE__';
  getFarmStyles.setAttribute('rel','stylesheet');
  getFarmStyles.setAttribute('type','text/css');
  document.head.appendChild(getFarmStyles);
  // <div id="app"></div>
  if (!document.getElementById('app')) {
    var getFarmWrapper = document.createElement('div');
    getFarmWrapper.setAttribute('id','app');
    document.body.appendChild(getFarmWrapper);
  }
  // manifest.js
  var getFarmManifest = document.createElement('script');
  getFarmManifest.src = 'https://www.getfarmcredit.com/modules/custom/getfarmcreditmap/js/__VAR_MANIFEST__';
  getFarmManifest.setAttribute('type','text/javascript');
  getFarmManifest.async = true;
  document.body.appendChild(getFarmManifest);
  // vendor.js
  var getFarmVendor = document.createElement('script');
  getFarmVendor.src = 'https://www.getfarmcredit.com/modules/custom/getfarmcreditmap/js/__VAR_VENDOR__';
  getFarmVendor.setAttribute('type','text/javascript');
  getFarmVendor.async = true;
  document.body.appendChild(getFarmVendor);
  document.addEventListener("DOMContentLoaded", function(event) { 
    // app.js
    var getFarmApp = document.createElement('script');
    getFarmApp.src = 'https://www.getfarmcredit.com/modules/custom/getfarmcreditmap/js/__VAR_APP__';
    getFarmApp.setAttribute('type','text/javascript');
    getFarmApp.async = true;
    document.body.appendChild(getFarmApp);
  };
})();