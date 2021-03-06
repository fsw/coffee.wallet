'use strict';
/* global pdf */
/* global device */
/* global NativeStorage */
/* global FingerprintAuth */
/* global coffee */
/* global jsPDF */

var __OS_PLUGINS__ = {

  getStorage: function() { return NativeStorage; },
  getPlatformName: function(){ return device.platform; },
  jsPdfLoaded: false,

  generatePngWithQRCode: function(text, size) {
    var tmpElement = document.createElement('div');
    var qrcode = new window.QRCode(tmpElement, {
            text: text,
            width: size,
            height: size,
            colorDark : "#000000",
            colorLight : "#ffffff"
    });
    return qrcode._oDrawing._elCanvas.toDataURL("image/png");
  },
  generatePDFwithJsPdf: function(data, file, success, error){
      var doc = new jsPDF();
      doc.setFontType("bold");
      doc.setFontSize(25);
      doc.text(data.title, 10, 15);
      doc.setFontType("normal");

      doc.setFontSize(17);
      doc.text('public key (address)', 200, 20, 'right');
      doc.addImage(data.publicImg, 'PNG', 108, 26, 92, 92);
      doc.setFontSize(14);
      doc.text(data.publicText, 200, 130, 'right');

      doc.setFontSize(12);
      doc.text('Share the public key to accept payments.', 10, 64);
      doc.text('It allows sending coins to this wallet.', 10, 74);

      doc.setLineWidth(0.5);
      doc.line(10, 139, 200, 139);

      doc.setFontSize(17);
      doc.text('private key (secret)', 10, 150);
      doc.addImage(data.privateImg, 'PNG', 10, 156, 102, 102);
      doc.setFontSize(14);
      doc.text(data.privateText, 10, 270);

      doc.setFontSize(12);
      doc.text('Keep this part secret and safe.', 200, 208, 'right');
      doc.text('It allows coins to be spent.', 200, 218, 'right');

      doc.setFontType("italic");
      doc.text(data.footer, 200, 286, 'right');
      doc.save(file + ".pdf");
      success();
  },
  generatePDF: function(data, file, success, error){
    data.publicImg = this.generatePngWithQRCode(data.publicText, 280);
    data.privateImg = this.generatePngWithQRCode(data.privateText, 350);
    if (device.platform == 'browser') {
      var that = this;
      if (this.jsPdfLoaded) {
          that.generatePDFwithJsPdf(data, file, success, error);
      } else {
        var script = document.createElement('script');
        script.src = 'vendor/jspdf.min.js';
        document.body.append(script);
        script.addEventListener('load', function () {
            that.jsPdfLoaded = true;
            that.generatePDFwithJsPdf(data, file, success, error);
        });
      }
      /*var element = document.createElement('a');
      element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
      element.setAttribute('download', file + '.html');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      success();*/
    } else {
      var html = '<html><h1>' + data.title + '</h1>' +
        '<div style="text-align:right;"><h2>public key (address)</h2><img src="' + data.publicImg + '"><h3>' + data.publicText + '</h3></div>'+
        '<hr/>' +
        '<h2>private key (secret)</h2><img src="' + data.privateImg + '"><h3>' + data.privateText + '</h3>'+
        '<div style="position:absolute; bottom:0; right:0; text-align:right;">Share the public key to accept coins. <br/>Keep private key secret and safe. It allows your coins to be spent. '+
        '<br/>' + data.footer + '</div>'+
        '</html>';
      document.getElementById('loading').classList.add('show');
      pdf.fromData(html, {
          documentSize: 'A4',
          type: 'share',
          fileName: file
      })
      .then(function(stats){
        document.getElementById('loading').classList.remove('show');
        success();
      })
      .catch(function(err) {
        document.getElementById('loading').classList.remove('show');
        error(err);
      });
    }
  },
  scanQRCode: function(success, error) {

    if (device.platform == 'browser') {
        error('Scanning not yet supported in PWA');
    } else {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.canceled) {
                    success(result.text);
                }
            },
            error,
            {
                preferFrontCamera : false, // iOS and Android
                showFlipCameraButton : true, // iOS and Android
                showTorchButton : true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                prompt : "Place addres or transaction barcode inside the scan area", // Android
            }
        );
    }
  },
  openInSystemBrowser: function(url) {
    //ugly fix for weird iOS bug
    app.lastOpenedUrl = url;
    window.open(url, '_system');
  },
  openRateAppDialog: function() {
    if (device.platform == 'Android') {
      this.openInSystemBrowser('market://details?id=coffee.software.coffeewallet');
    } else if (device.platform == 'iOS') {
      this.openInSystemBrowser('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id1433984988?ls=1&mt=8');
    } else {
      app.alertError('Rating is not available on this platform');
    }
  },
  shareDialog: function(subject, message, successHandler, errorHandler) {

    if (device.platform == 'browser') {
      this.copyToClipboard(message);
      app.alertSuccess('Share message copied to clipboard');
      successHandler();
      return;
    }
    document.getElementById('loading').classList.add('show');
    window.plugins.socialsharing.shareWithOptions(
      {
        message: message,
        subject: subject,
      },
      function() {
        document.getElementById('loading').classList.remove('show');
        successHandler();
      },
      function(error) {
        document.getElementById('loading').classList.remove('show');
        errorHandler(error);
      }
    );

  },
  copyToClipboard: function(text) {
    if (device.platform == 'browser') {
      var tmpInputElement = document.createElement('textarea');
      tmpInputElement.value = text;
      document.body.appendChild(tmpInputElement);
      tmpInputElement.select();
      document.execCommand('Copy');
      document.body.removeChild(tmpInputElement);
    } else {
      cordova.plugins.clipboard.copy(text);
    }
  },

    pasteFromClipboard: function(callback) {
        if (device.platform == 'browser') {
            navigator.clipboard.readText()
                .then(callback)
                .catch(function(err){
                    throw new Error('Failed to read clipboard contents');
                });
        } else {
            cordova.plugins.clipboard.paste(callback);
        }
    },

  browserCheckPersisted: function() {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function (isPersisted){
        if (!isPersisted) {
            document.getElementById('pwaInfo').classList.add('show');
            document.getElementById('pwaPersist').classList.add('show');
        }
      });
    } else {
        document.getElementById('pwaInfo').classList.add('show');
        document.getElementById('pwaPersist').classList.add('show');
    }
  },
  browserInitPWA: function() {
    var deferredPrompt;
    if (window.location.hostname != 'app.wallet.coffee') {
        document.getElementById('pwaInfo').classList.add('show');
        document.getElementById('pwaBeta').classList.add('show');
    }
    var isPwa = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    if (!isPwa) {
        document.getElementById('pwaInfo').classList.add('show');
        document.getElementById('pwaInstall').classList.add('show');
        window.addEventListener('beforeinstallprompt', function(e){
          e.preventDefault();
          deferredPrompt = e;
          document.getElementById('installPwa').classList.add('show');
        });
        document.getElementById('installPwa').addEventListener('click', function () {
          document.getElementById('installPwa').classList.remove('show');
          deferredPrompt.prompt();
          deferredPrompt = null;
          //const { outcome } = await deferredPrompt.userChoice;
        });
        window.addEventListener('appinstalled', function(evt) {
            window.location.reload(true);
        });
    }
  },
  confirmBeforeUpdate: function(registration, currentVersion, newVersion, callback) {
    navigator.splashscreen.hide();
    document.getElementById('loading').classList.remove('show');
    app.confirmBeforeContinue(
        'Update Available',
        'New version of Coffee Wallet is available.<br/>' +
        'You are running: <strong>' + currentVersion + '</strong><br/>' +
        'New version available: <strong>' + newVersion + '</strong><br/>' +
        'It is recommended to update to latest version.',
        function(){
            document.getElementById('loading').classList.add('show');
            navigator.serviceWorker.ready.then(function(registration) {
                registration.update().then(function(){
                     window.location.reload(true);
                });
            });
        },
        'Update Now',
        'Later',
        function(){
            callback();
        }
    );
  },
    hideNativeSplash: function() {
        navigator.splashscreen.hide();
    },
    authenticateUser: function(callback){
        if (device.platform == "Android") {
            FingerprintAuth.isAvailable(function(result){
                if(result.isAvailable) {
                    FingerprintAuth.encrypt(
                        {
                            clientId: "coffee",
                            username: "user",
                            password: "__dummy"
                        },
                        function(){
                            app.alertSuccess("auth successfull");
                            callback();
                        }, function(err){
                            app.alertError("auth error: " + err);
                        }
                    );
                } else {
                    callback();
                }
            }, function(){
                callback();
            });
        } else if(device.platform == "iOS") {
            window.plugins.touchid.isAvailable(function(){
                window.plugins.touchid.verifyFingerprintWithCustomPasswordFallback(
                    "Scan your fingerprint to confirm",
                    function(){
                        app.alertSuccess("auth successfull");
                        callback();
                    }, function(err){
                        app.alertError("auth error: " + JSON.stringify(err));
                    }
                );
            }, function(){
                callback();
            });
        } else {
            callback();
        }
    },
  checkForUpdates: function(callback) {
    var that = this;
    if (device.platform == 'browser' && (window.location.port != "8000")) {
        this.browserCheckPersisted();
        this.browserInitPWA();
        //TODO protocol handler:
        //navigator.registerProtocolHandler('web+coffee', 'http://localhost:8879/TEST?%s', 'Coffee Wallet');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').then(function(registration) {
                //console.log('ServiceWorker registration successful with scope: ', registration.scope);
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() {
                    if (xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 200) {
                            var newVersionData = JSON.parse(xmlHttp.responseText);
                            if (newVersionData.version != coffee.App.getVersion()) {
                                that.confirmBeforeUpdate(registration, coffee.App.getVersion(), newVersionData.version, callback);
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                };
                xmlHttp.open( "GET", '/version.json', true );
                xmlHttp.send( null );
            }, function(err) {
                //console.log('ServiceWorker registration failed: ', err);
            });
        } else {
           callback();
        }
    } else {
        callback();
    }
  }
};

var OsPlugins = __OS_PLUGINS__;