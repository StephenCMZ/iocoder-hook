// ==UserScript==
// @name         iocoder hook
// @namespace   https://github.com/StephenCMZ/iocoder-hook.git
// @version      0.1
// @description  iocoder hook
// @author       StephenChen
// @match        *://doc.iocoder.cn/*
// @grant        none
// @downloadURL  https://github.com/StephenCMZ/iocoder-hook/blob/main/index.js
// @updateURL    https://github.com/StephenCMZ/iocoder-hook/blob/main/index.js
// ==/UserScript==

(function () {
  'use strict';

  const cookieName = '88974ed8-6aff-48ab-a7d1-4af5ffea88bb';

  // 检查 cookie 是否已存在
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // 只在 cookie 不存在时设置
  if (!getCookie(cookieName)) {
    document.cookie = `${cookieName}=mantou; path=/; max-age=31536000; domain=.doc.iocoder.cn`;
    console.log(`Cookie 已设置：${cookieName}=mantou`);
  }

  // 拦截 XHR 请求
  const originalXHR = window.XMLHttpRequest;
  function newXHR() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;

    xhr.open = function () {
      const url = arguments[1];
      if (url && url.includes('svip.iocoder.cn/zsxq/auth')) {
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            Object.defineProperty(xhr, 'response', {
              value: 'true',
              writable: true,
            });
            Object.defineProperty(xhr, 'responseText', {
              value: 'true',
              writable: true,
            });
          }
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments);
          }
        };
      }
      originalOpen.apply(this, arguments);
    };

    xhr.send = function () {
      originalSend.apply(this, arguments);
    };

    return xhr;
  }

  window.XMLHttpRequest = newXHR;
})();
