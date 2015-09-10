var loader = $(".load"),
    c16 = $(".n16"),
    c32 = $(".n32"),
    c64 = $(".n64"),
    canvas = $(".holder"),
    holder = document.getElementById("imageloader"),
    ctx16 = c16[0].getContext("2d"),
    ctx32 = c32[0].getContext("2d"),
    ctx64 = c64[0].getContext("2d"),
    ctx = canvas[0].getContext("2d");

function displayPreview(file) {
  var reader = new FileReader();

  reader.onload = function(e) {
    var img = new Image();
    var img16 = new Image();
    var img32 = new Image();
    var img64 = new Image();
    img.src = e.target.result;
    img16.src = e.target.result;
    img32.src = e.target.result;
    img64.src = e.target.result;
    img16.onload = function() {
      // x, y, width, height
      ctx16.drawImage(img16, 0, 0, 16, 16);
    };
    img32.onload = function() {
      // x, y, width, height
      ctx32.drawImage(img32, 0, 0, 32, 32);
    };
    img64.onload = function() {
      // x, y, width, height
      ctx64.drawImage(img64, 0, 0, 64, 64);
    };
    img.onload = function() {
      // x, y, width, height
      ctx.drawImage(img, 0, 0, 128, 128);
    };
  };
  reader.readAsDataURL(file);
}

$(document).ready(function() {
  var AppName = $(".appname").val(),
      AppUrl = $(".appurl").val(),
      ZipName = $(".zipname").val(AppName).val($(".zipname").val().split(" ").join("")),
      executeApp = function(file) {
        var reader = new FileReader();
    
        reader.onload = function(e) {
          // Download as Windows App
          $(".export-as-win-app").on("click", function() {
            JSZipUtils.getBinaryContent("YourWinApp.zip", function(err, data) {
              if(err) {
                throw err; // or handle err
              }
              
              var zip = new JSZip(data);
              
              // Your Web App
              var Img16 = c16[0].toDataURL("image/png");
              var Img32 = c32[0].toDataURL("image/png");
              var Img64 = c64[0].toDataURL("image/png");
              var Img128 = canvas[0].toDataURL("image/png");
              zip.file("data/content/icons/16.png", Img16.split('base64,')[1],{base64: true});
              zip.file("data/content/icons/32.png", Img32.split('base64,')[1],{base64: true});
              zip.file("data/content/icons/64.png", Img64.split('base64,')[1],{base64: true});
              zip.file("data/content/icons/128.png", Img128.split('base64,')[1],{base64: true});
              zip.file("data/content/css/style.css", "html, body {\n  height: 100%;\n  padding: 0;\n  margin: 0;\n  overflow: hidden;\n}\n\niframe {\n  width: 100%;\n  height: 100%;\n  border: 0;\n}");
              zip.file("data/content/index.html", "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ $(".appname").val() +"</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"css/style.css\" />\n  </head>\n  <body>\n    <iframe src=\""+ $(".appurl").val() +"\">\n      Your browser does not support iFrame html elements.\n    </iframe>\n  </body>\n</html>");
              var content = zip.generate({type:"blob"});
              saveAs(content, $(".zipname").val() + "-win.zip");
              return false;
            });
            return false;
          });
          
          // Download as Mac App
          $(".export-as-mac-app").on("click", function() {
            JSZipUtils.getBinaryContent("YourMacApp-32bit.zip", function(err, data) {
              if(err) {
                throw err; // or handle err
              }
              
              var zip = new JSZip(data);
              
              // Your Web App
              var Img16 = c16[0].toDataURL("image/png");
              var Img32 = c32[0].toDataURL("image/png");
              var Img64 = c64[0].toDataURL("image/png");
              var Img128 = canvas[0].toDataURL("image/png");
              zip.file("data/content/icons/16.png", Img16.split('base64,')[1],{base64: true});
              zip.file("data/content/icons/32.png", Img32.split('base64,')[1],{base64: true});
              zip.file("data/content/icons/64.png", Img64.split('base64,')[1],{base64: true});
              zip.file("data/content/icons/128.png", Img128.split('base64,')[1],{base64: true});
              
              zip.file("data/package.json", '{\n  "main"  : "content/index.html",\n  "name"  : "'+ $(".appname").val() +'",\n  "window": {\n    "toolbar"    : false,\n    "frame"      : false,\n    "transparent": true\n  }\n}');
              
              zip.file("data/content/index.html", '<!doctype html>\n<html>\n <head>\n    <title>'+ $(".appname").val() +'</title>\n    <link rel="stylesheet" href="css/style.css">\n  </head>\n <body>\n    <div class="container">\n      <div class="titlebar txtcenter">\n        <div class="fl menubtns">\n          <a class="fl close">\n            <i class="fa fa-times"></i>\n          </a>\n          <a class="fl minimize">\n            <i class="fa fa-minus"></i>\n          </a>\n          <a class="fl maximize">\n            <i class="maxtr fa fa-caret-left"></i>\n            <i class="maxbl fa fa-caret-left"></i>\n          </a>\n        </div>\n        \n        <span data-set="appname"></span>\n      </div>\n\n      <iframe src="'+ $(".appurl").val() +'"></iframe>\n    </div>\n\n    <script src="js/main.js"></script>\n  </body>\n</html>');
              zip.file("data/content/js/main.js", 'document.addEventListener("DOMContentLoaded", function() {\n  // Load library\n  var gui = require("nw.gui");\n\n  // Reference to window\n  var win = gui.Window.get();\n\n  document.querySelector(".close").onclick = function() {\n    window.close();\n  };\n\n  document.querySelector(".minimize").onclick = function() {\n    win.minimize();\n  };\n\n  document.querySelector(".titlebar").addEventListener("dblclick", function() {\n    if (win.isMaximized) {\n      win.unmaximize();\n      win.isMaximized = false;\n    } else {\n      win.maximize();\n    }\n  });\n\n  document.querySelector(".maximize").onclick = function() {\n    if (win.isMaximized) {\n      win.unmaximize();\n      win.isMaximized = false;\n    } else {\n      win.maximize();\n    }\n  };\n\n  win.on("maximize", function() {\n    win.isMaximized = true;\n  });\n  win.on("unmaximize", function() {\n    win.isMaximized = false;\n  });\n  win.on("enter-fullscreen", function() {\n    document.querySelector(".titlebar").classList.toggle("hide");\n    document.querySelector("iframe").style.top = 0;\n    document.querySelector("iframe").style.height = "100%";\n  });\n  win.on("leave-fullscreen", function() {\n    document.querySelector(".titlebar").classList.toggle("hide");\n    document.querySelector("iframe").style.top = 28 + "px";\n    document.querySelector("iframe").style.height = window.innerHeight - 28 + "px";\n  });\n  document.querySelector("iframe").style.height = window.innerHeight - 28 + "px";\n\n  window.addEventListener("keydown", function(e) {\n  // Reload App (CMD+R)\n    if ( e.metaKey && e.keyCode == 82 ) {\n      location.reload(true);\n    } else \n  // Hide Mac App (CMD+W)\n    if ( e.metaKey && e.keyCode == 87 ) {\n      win.hide();\n    }\n    // else\n  // Toggle fullscreen window (CTRL+CMD+F)\n    // if ( e.shiftKey && e.metaKey && e.keyCode == 70 ) {\n      // win.toggleFullscreen();\n    // }\n  });\n\n  // Close buttons hides app\n  // var hidden = false;\n  // gui.App.on("reopen", function(){\n  //   hidden = false;\n  //   win.show();\n  // })\n\n  // win.on("close", function(){\n  //   if (hidden == true) {\n  //     gui.App.quit();\n  //   } else {\n  //     win.hide();\n  //     hidden = true;\n  //   }\n  // });\n\n  // Create menu container\n  var Menu = new gui.Menu({\n    type: "menubar"\n  });\n\n  //initialize default mac menu\n  Menu.createMacBuiltin("'+ $(".appname").val() +'");\n\n  // Get the root menu from the default mac menu\n  var rootMenu = Menu.items[2].submenu;\n\n  // Append new item to root menu\n  rootMenu.insert(\n    new gui.MenuItem({\n      type: "normal",\n      label: "Toggle Fullscreen",\n      key: "F",\n      modifiers: "cmd",\n      click : function () {\n        win.toggleFullscreen();\n      }\n    })\n  );\n\n  rootMenu.insert(\n    new gui.MenuItem({\n      type: "normal",\n      label: "Reload App",\n      key: "R",\n      modifiers: "shift-cmd",\n      click : function () {\n        location.reload(true);\n      }\n    })\n  );\n\n  // Append Menu to Window\n  gui.Window.get().menu = Menu;\n\n  // Show app name in titlebar\n  document.querySelector("[data-set=appname]").innerHTML = document.title;\n\n  // Responsive UI\n  window.addEventListener("resize", function() {\n    document.querySelector("iframe").style.height = window.innerHeight - 28 + "px";\n  });\n});');
              zip.file("run.sh", "open -a /Applications/"+ $(".zipname").val() +".app/Contents/data/"+ $(".zipname").val() +".app");
              
              zip.file("README", "If WebDGap was at all helpful for you. Would you consider donating to the project?\nhttps://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BSYGA2RB5ZJCC\n\n");
              var content = zip.generate({type:"blob"});
              saveAs(content, $(".zipname").val() + "-mac.zip");
              return false;
            });
            return false;
          });
          
          // Download as Linux App
          $(".export-as-lin-app").on("click", function() {
            JSZipUtils.getBinaryContent("YourLinApp.zip", function(err, data) {
              if(err) {
                throw err; // or handle err
              }
              
              var zip = new JSZip();
              var appName = zip.folder( $(".appname").val().replace(/ /g, "-")  );
              appName.load(data);
              
              var Img16 = c16[0].toDataURL("image/png");
              var Img32 = c32[0].toDataURL("image/png");
              var Img64 = c64[0].toDataURL("image/png");
              var Img128 = canvas[0].toDataURL("image/png");
              appName.file("resources/default_app/icons/16.png", Img16.split('base64,')[1],{base64: true});
              appName.file("resources/default_app/icons/32.png", Img32.split('base64,')[1],{base64: true});
              appName.file("resources/default_app/icons/64.png", Img64.split('base64,')[1],{base64: true});
              appName.file("resources/default_app/icons/128.png", Img128.split('base64,')[1],{base64: true});
              appName.file("resources/default_app/index.html", '<!DOCTYPE html>\n<html>\n  <head>\n    <title>'+ $(".appname").val() +'</title>\n    <style>\n      html, body {\n        height: 100%;\n      }\n      body {\n        margin: 0;\n        padding: 0;\n        overflow: hidden;\n      }\n      iframe {\n        width: 100%;\n        height: 100%;\n        border: 0;\n      }\n    </style>\n  </head>\n  <body>\n    <iframe src="'+ $(".appurl").val() +'"></iframe>\n  </body>\n</html>');
              
              zip.file("make.sh", "if [ -d ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +" ]; then\n  typeset LP_FILE=${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"/"+ $(".appname").val().replace(/ /g, "-") +".desktop\n\n  # Remove the target file if any\n  rm -f ${LP_FILE}\n  printf \"%s[Desktop Entry]\\nName="+ $(".appname").val() +"\\nPath=${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"\\nActions=sudo\\nExec=./"+ $(".appname").val().replace(/ /g, "-") +"/electron\\nIcon=${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"/resources/default_app/icons/128.png\\nTerminal=true\\nType=Application\\nStartupNotify=true > ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +".desktop\" >> ${LP_FILE}\n\n  echo 'Your application and launcher are now located at ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"'\n  rm README.md\n  rm make.sh\n  cd ../\n  rmdir "+ $(".appname").val().replace(/ /g, "-") +"-lin\n  cd ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"/\n  chmod 775 electron\nfi\n\nif [ ! -d ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +" ]; then\n  mv "+ $(".appname").val().replace(/ /g, "-") +" ${HOME}\n\n  typeset LP_FILE=${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"/"+ $(".appname").val().replace(/ /g, "-") +".desktop\n\n  # Remove the target file if any\n  rm -f ${LP_FILE}\n  printf \"%s[Desktop Entry]\\nName="+ $(".appname").val() +"\\nPath=${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"\\nActions=sudo\\nExec=./"+ $(".appname").val().replace(/ /g, "-") +"/electron\\nIcon=${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"/resources/default_app/icons/128.png\\nTerminal=true\\nType=Application\\nStartupNotify=true > ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +".desktop\" >> ${LP_FILE}\n\n  echo 'Your application and launcher are now located at ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"'\n  rm README.md\n  rm make.sh\n  cd ../\n  rmdir "+ $(".appname").val().replace(/ /g, "-") +"-lin\n  cd ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +"/\n  chmod 775 electron\nfi\n\n# For Windows OS\n#if EXIST ${HOME}/"+ $(".appname").val().replace(/ /g, "-") +" (\n  #echo Yes\n#) ELSE (\n  #echo No\n#)\n");
              appName.file("resources/default_app/package.json", "{\n  \"name\": \""+ $(".appname").val() +"\",\n  \"productName\": \""+ $(".appname").val() +"\",\n  \"version\": \"0.1.0\",\n  \"main\": \"default_app.js\",\n  \"license\": \"BSD-2-Clause\"\n}\n");
              var content = zip.generate({type:"blob"});
              saveAs(content, $(".zipname").val() + "-lin.zip");
              return false;
            });
            return false;
          });
          
          // Download as a Chromebook App
          $(".export-as-chrome-app").on("click", function() {
            var zip = new JSZip();
            
            // Your Web App
            var Img128 = canvas[0].toDataURL("image/png");
            zip.file("assets/logo.png", Img128.split('base64,')[1],{base64: true});
            zip.file("background.js", "/**\n * Listens for the app launching, then creates the window.\n *\n * @see http://developer.chrome.com/apps/app.runtime.html\n * @see http://developer.chrome.com/apps/app.window.html\n */\nchrome.app.runtime.onLaunched.addListener(function(launchData) {\n  chrome.app.window.create(\n    'index.html',\n    {\n      id: 'mainWindow',\n      innerBounds: {\n        'width': 800,\n        'height': 600\n      }\n    }\n  );\n});");
            zip.file("manifest.json", '{\n  "manifest_version": 2,\n  "name": "'+ $(".zipname").val() +'",\n  "short_name": "'+ $(".zipname").val() +'",\n  "description": "A native '+ $(".zipname").val() +' standalone webview app for your Chrome Browser.",\n  "version": "1.0",\n  "minimum_chrome_version": "38",\n  "permissions":[ "webview", "storage", "fileSystem", "unlimitedStorage", "http://*/", "https://*/" ],\n  "icons": {\n    "16": "assets/logo.png",\n    "48": "assets/logo.png",\n    "64": "assets/logo.png",\n    "128": "assets/logo.png"\n  },\n\n  "app": {\n    "background": {\n      "scripts": ["background.js"]\n    }\n  }\n}\n');
            zip.file("css/style.css", "html, body {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n}\n\nwebview {\n  width: 100%;\n  height: 100%;\n}");
            zip.file("index.html", "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ $(".zipname").val() +"</title>\n    <link rel=\"stylesheet\" href=\"css/style.css\" />\n  </head>\n  <body>\n    <webview src=\""+ $(".appurl").val() +"\">\n      Your Chromebook does not support the WebView html5 element.\n    </webview>\n  </body>\n</html>");
            var content = zip.generate({type:"blob"});
            saveAs(content, $(".zipname").val() + ".zip");
            return false;
          });
          return false;
        };
        reader.readAsArrayBuffer(file); 
      };
      
  // Detect if users browser can download files in Javascript
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Detect if users browser can download files in Javascript
  } else {
    alert("The File APIs are not fully supported in this browser.");
  }
  
  $(window).on("load resize", function() {
    if ( $(window).width() > 670 ) {
      $("#imageloader").attr("class", "").css("margin", "20px 10em");
    } else {
      $("#imageloader").attr("class", "fill").attr("style", "");
    }
  });
  
  // Application Fields (App Name and URL)
  $("input").on("keyup change", function() {
    var AppName = $(".appname").val(),
        AppUrl = $(".appurl").val(),
        AppImg = loader.val();
        
    $(".zipname").val(AppName).val($(".zipname").val().split(" ").join(""));
    
    if ((AppName === "") || (AppUrl === "")) {
      $(".check, .checkimageloader").addClass("hide");
    } else {
      $(".checkimageloader").removeClass("hide");
      if (AppUrl.toLowerCase().substring(0,7) === "http://") {
      } else if (AppUrl.toLowerCase().substring(0,8) === "https://") {
        $(".export-as-chrome-app").addClass("hide");
        alertify.log("AppUrl must not contain \"https\".<br /><br /> If needed use <a href=\"https://bitly.com/shorten/\">Bitly</a> to set url to http.");
      }
    }
  });
  
  // Drag and drop image load
  holder.ondragover = function () {
    this.className = "hover";
    return false;
  };
  holder.ondragend = function () {
    this.className = "";
    return false;
  };
  holder.ondrop = function(evt) {
    $(".logo, .check").removeClass("hide");
    this.className = "";
    evt.preventDefault();
    var file = evt.dataTransfer.files[0];
    displayPreview(file);
    executeApp(file);
  };

  // Image Viewer
  loader.on("change", function(evt) {
    $(".logo, .check").removeClass("hide");
    var file = evt.target.files[0];
    displayPreview(file);
    executeApp(file);
  });
  $(".load-logo").on("click", function() {
    loader.trigger("click");
  });
  
  // Download Source Code
  $(".export-source").on("click", function() {
    var zip = new JSZip();
    
    // Your Web App
    zip.file("css/style.css", "html, body {\n  height: 100%;\n  padding: 0;\n  margin: 0;\n  overflow: hidden;\n}\n\niframe {\n  width: 100%;\n  height: 100%;\n  border: 0;\n}");
    zip.file("index.html", "<!DOCTYPE html>\n<html>\n  <head>\n    <title>"+ $(".zipname").val() +"</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=9\" />\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"css/style.css\" />\n  </head>\n  <body>\n    <iframe src=\""+ $(".appurl").val() +"\">\n      Your browser does not support iFrame html elements.\n    </iframe>\n  </body>\n</html>");
    var content = zip.generate({type:"blob"});
    saveAs(content, $(".zipname").val() + ".zip");
    return false;
  });
  return false;
});
