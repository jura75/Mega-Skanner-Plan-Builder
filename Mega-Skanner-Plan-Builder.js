javascript:(function(){
  if (typeof game_data === 'undefined') {
    alert('Откройте игру Война Племен!');
    return;
  }

  // 1. Инициализация twLib для очередей запросов
  if (typeof window.twLib === 'undefined') {
    window.twLib = {
      queues: null,
      init: function () {
        if (this.queues === null) {
          this.queues = this.queueLib.createQueues(5);
        }
      },
      queueLib: {
        maxAttempts: 3,
        Item: function (action, arg, promise = null) {
          this.action = action;
          this.arguments = arg;
          this.promise = promise;
          this.attempts = 0;
        },
        Queue: function () {
          this.list = [];
          this.working = false;
          this.length = 0;
          this.doNext = function () {
            let item = this.dequeue();
            let self = this;
            if (item.action === 'openWindow') {
              window.open(...item.arguments).addEventListener('DOMContentLoaded', function () {
                self.start();
              });
            } else {
              $[item.action](...item.arguments).done(function () {
                item.promise.resolve.apply(null, arguments);
                self.start();
              }).fail(function () {
                item.attempts += 1;
                if (item.attempts < twLib.queueLib.maxAttempts) {
                  self.enqueue(item, true);
                } else {
                  item.promise.reject.apply(null, arguments);
                }
                self.start();
              });
            }
          };
          this.start = function () {
            if (this.length) {
              this.working = true;
              this.doNext();
            } else {
              this.working = false;
            }
          };
          this.dequeue = function () {
            this.length -= 1;
            return this.list.shift();
          };
          this.enqueue = function (item, front = false) {
            (front) ? this.list.unshift(item) : this.list.push(item);
            this.length += 1;
            if (!this.working) {
              this.start();
            }
          };
        },
        createQueues: function (amount) {
          let arr = [];
          for (let i = 0; i < amount; i++) {
            arr[i] = new twLib.queueLib.Queue();
          }
          return arr;
        },
        addItem: function (item) {
          let leastBusyQueue = twLib.queues.map(q => q.length).reduce((next, curr) => (curr < next) ? curr : next, 0);
          twLib.queues[leastBusyQueue].enqueue(item);
        },
        orchestrator: function (type, arg) {
          let promise = $.Deferred();
          let item = new twLib.queueLib.Item(type, arg, promise);
          twLib.queueLib.addItem(item);
          return promise;
        }
      },
      ajax: function () { return twLib.queueLib.orchestrator('ajax', arguments); },
      get: function () { return twLib.queueLib.orchestrator('get', arguments); },
      post: function () { return twLib.queueLib.orchestrator('post', arguments); },
      openWindow: function () {
        let item = new twLib.queueLib.Item('openWindow', arguments);
        twLib.queueLib.addItem(item);
      }
    };
    window.twLib.init();
  }

  // 2. LZString для кэширования карты
  if (typeof window.LZString === 'undefined') {
    window.LZString = function () {
      var r = String.fromCharCode;
      var i = {
        compressToUTF16: function (o) {
          return null == o ? '' : i._compress(o, 15, function (o) { return r(o + 32); }) + ' ';
        },
        decompressFromUTF16: function (r) {
          return null == r ? '' : '' == r ? null : i._decompress(r.length, 16384, function (o) { return r.charCodeAt(o) - 32; });
        },
        _compress: function (r, o, n) {
          if (null == r) return '';
          var e, t, i, s = {}, u = {}, a = '', p = '', c = '', l = 2, f = 3, h = 2, d = [], m = 0, v = 0;
          for (i = 0; i < r.length; i += 1) if (a = r.charAt(i), Object.prototype.hasOwnProperty.call(s, a) || (s[a] = f++, u[a] = !0), p = c + a, Object.prototype.hasOwnProperty.call(s, p)) c = p; else {
            if (Object.prototype.hasOwnProperty.call(u, c)) {
              if (c.charCodeAt(0) < 256) {
                for (e = 0; e < h; e++) m <<= 1, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                for (t = c.charCodeAt(0), e = 0; e < 8; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
              } else {
                for (t = 1, e = 0; e < h; e++) m = m << 1 | t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                for (t = c.charCodeAt(0), e = 0; e < 16; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
              }
              0 == --l && (l = Math.pow(2, h), h++), delete u[c];
            } else for (t = s[c], e = 0; e < h; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            0 == --l && (l = Math.pow(2, h), h++), s[p] = f++, c = String(a);
          }
          if ('' !== c) {
            if (Object.prototype.hasOwnProperty.call(u, c)) {
              if (c.charCodeAt(0) < 256) {
                for (e = 0; e < h; e++) m <<= 1, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                for (t = c.charCodeAt(0), e = 0; e < 8; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
              } else {
                for (t = 1, e = 0; e < h; e++) m = m << 1 | t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                for (t = c.charCodeAt(0), e = 0; e < 16; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
              }
              0 == --l && (l = Math.pow(2, h), h++), delete u[c];
            } else for (t = s[c], e = 0; e < h; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            0 == --l && (l = Math.pow(2, h), h++);
          }
          for (t = 2, e = 0; e < h; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
          for (; ;) {
            if (m <<= 1, v == o - 1) {
              d.push(n(m));
              break;
            }
            v++;
          }
          return d.join('');
        },
        _decompress: function (o, n, e) {
          var t, i, s, u, a, p, c, l = [], f = 4, h = 4, d = 3, m = '', v = [],
            g = {val: e(0), position: n, index: 1};
          for (t = 0; t < 3; t += 1) l[t] = t;
          for (s = 0, a = Math.pow(2, 2), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
          switch (s) {
            case 0:
              for (s = 0, a = Math.pow(2, 8), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
              c = r(s);
              break;
            case 1:
              for (s = 0, a = Math.pow(2, 16), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
              c = r(s);
              break;
            case 2:
              return '';
          }
          for (l[3] = c, i = c, v.push(c); ;) {
            if (g.index > o) return '';
            for (s = 0, a = Math.pow(2, d), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
            switch (c = s) {
              case 0:
                for (s = 0, a = Math.pow(2, 8), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
                l[h++] = r(s), c = h - 1, f--;
                break;
              case 1:
                for (s = 0, a = Math.pow(2, 16), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
                l[h++] = r(s), c = h - 1, f--;
                break;
              case 2:
                return v.join('');
            }
            if (0 == f && (f = Math.pow(2, d), d++), l[c]) m = l[c]; else {
              if (c !== h) return null;
              m = i + i.charAt(0);
            }
            v.push(m), l[h++] = i + m.charAt(0), i = m, 0 == --f && (f = Math.pow(2, d), d++);
          }
        }
      };
      return i;
    }();
  }

  const version = 'v7.7 (Clean Syntax)';
  let storedVillageList = {};
  const coordinateRegex = /\d{1,3}\|\d{1,3}/g;

  let globalDraggingState = { isDragging: false, targetWin: null, startX: 0, startY: 0, startLeft: 0, startTop: 0 };
  let globalResizingState = { isResizing: false, targetWin: null, resizeDir: '', startX: 0, startY: 0, startWidth: 0, startHeight: 0, startLeft: 0, startTop: 0 };

  if (!window._globalWindowEngineInitialized) {
    window._globalWindowEngineInitialized = true;
    document.addEventListener('mousemove', (e) => {
      if (globalDraggingState.isDragging && globalDraggingState.targetWin) {
        const dx = e.clientX - globalDraggingState.startX;
        const dy = e.clientY - globalDraggingState.startY;
        globalDraggingState.targetWin.style.left = `${globalDraggingState.startLeft + dx}px`;
        globalDraggingState.targetWin.style.top = `${globalDraggingState.startTop + dy}px`;
      }
      if (globalResizingState.isResizing && globalResizingState.targetWin) {
        const activeContainer = globalResizingState.targetWin;
        const dx = e.clientX - globalResizingState.startX;
        const dy = e.clientY - globalResizingState.startY;
        const dir = globalResizingState.resizeDir;

        if (dir.includes('right')) { activeContainer.style.width = `${Math.max(500, globalResizingState.startWidth + dx)}px`; activeContainer.style.maxWidth = 'none'; }
        if (dir.includes('bottom')) { activeContainer.style.height = `${Math.max(450, globalResizingState.startHeight + dy)}px`; activeContainer.style.maxHeight = 'none'; }
        if (dir.includes('left')) {
          const newWidth = globalResizingState.startWidth - dx;
          if (newWidth >= 500) { activeContainer.style.width = `${newWidth}px`; activeContainer.style.left = `${globalResizingState.startLeft + dx}px`; activeContainer.style.maxWidth = 'none'; }
        }
        if (dir.includes('top')) {
          const newHeight = globalResizingState.startHeight - dy;
          if (newHeight >= 450) { activeContainer.style.height = `${newHeight}px`; activeContainer.style.top = `${globalResizingState.startTop + dy}px`; activeContainer.style.maxWidth = 'none'; }
        }
      }
    });
    document.addEventListener('mouseup', () => {
      globalDraggingState.isDragging = false; globalDraggingState.targetWin = null;
      globalResizingState.isResizing = false; globalResizingState.targetWin = null;
    });
  }

  function makeWindowInteractive(windowElemId, headerElemId) {
    const $window = $(`#${windowElemId}`);
    const $header = $(`#${headerElemId}`);
    if (!$window.length || !$header.length) return;
    const winDom = $window.get(0);

    $header.off('mousedown').on('mousedown', (e) => {
      if (['BUTTON', 'INPUT', 'LABEL', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      globalDraggingState.isDragging = true; globalDraggingState.targetWin = winDom;
      globalDraggingState.startX = e.clientX; globalDraggingState.startY = e.clientY;
      const rect = winDom.getBoundingClientRect();
      globalDraggingState.startLeft = rect.left; globalDraggingState.startTop = rect.top;
      e.preventDefault();
    });

    $window.find('.resize-handle').off('mousedown').on('mousedown', (e) => {
      globalResizingState.isResizing = true; globalResizingState.targetWin = winDom;
      globalResizingState.resizeDir = e.target.className.replace('resize-handle ', '');
      globalResizingState.startX = e.clientX; globalResizingState.startY = e.clientY;
      const rect = winDom.getBoundingClientRect();
      globalResizingState.startWidth = rect.width; globalResizingState.startHeight = rect.height;
      globalResizingState.startLeft = rect.left; globalResizingState.startTop = rect.top;
      e.stopPropagation(); e.preventDefault();
    });
  }

  const loadVillageData = () => {
    const settings = JSON.parse(localStorage.getItem(`village_list_settings_${game_data.world}`)) ?? {lastCheckedAt: null, villages: {}};
    if (!settings.lastCheckedAt || Math.abs(new Date().getTime() - new Date(settings.lastCheckedAt).getTime()) / 36e5 > 1) {
      twLib.get({
        url: location.origin + '/map/village.txt',
        success: function (villages) {
          storedVillageList = villages.match(/[^\r\n]+/g).map(villageData => {
            const [id, name, x, y, player_id] = villageData.split(',');
            return {id: id, name: name, player_id: player_id, coordinates: `${x}|${y}`};
          });
          localStorage.setItem(`village_list_settings_${game_data.world}`, JSON.stringify({
            lastCheckedAt: new Date(),
            villages: LZString.compressToUTF16(JSON.stringify(storedVillageList))
          }));
          $("#twCacheCount").text(Object.keys(storedVillageList).length);
        }
      });
    } else {
      storedVillageList = JSON.parse(LZString.decompressFromUTF16(settings.villages));
    }
  };
  loadVillageData();

  $('#twAdvancedScannerWin').remove();

  let savedEnemy = localStorage.getItem(`tw_scanner_enemy_${game_data.world}`) || '';
  let savedOwn = localStorage.getItem(`tw_scanner_own_${game_data.world}`) || '';
  let savedTop = localStorage.getItem(`tw_scanner_top_${game_data.world}`) || '3';
  let savedMaxDist = localStorage.getItem(`tw_scanner_maxdist_${game_data.world}`) || '';
  let savedFetchCmds = localStorage.getItem(`tw_scanner_fetchcmds_${game_data.world}`) !== 'false';
  let savedAttacks = localStorage.getItem(`tw_scanner_attacks_${game_data.world}`) !== 'false';
  let savedSupports = localStorage.getItem(`tw_scanner_supports_${game_data.world}`) !== 'false';
  let savedReturns = localStorage.getItem(`tw_scanner_returns_${game_data.world}`) !== 'false';
  let savedHideReservations = localStorage.getItem(`tw_scanner_hidereservations_${game_data.world}`) === 'true';
  let savedNobleSearch = localStorage.getItem(`tw_scanner_noblesearch_${game_data.world}`) !== 'false';

  let panelHtml = `
  <div id="twAdvancedScannerWin" style="position:fixed; top:40px; left:60px; z-index:99999; background:#f4e4bc; border:2px solid #7d510f; width:940px; height:780px; box-shadow:0 0 15px rgba(0,0,0,0.5); display:flex; flex-direction:column; border-radius:6px; font-family:Verdana; font-size:11px;">
      <div class="resize-handle resize-top" style="position:absolute; top:-8px; left:0; right:0; height:16px; cursor:n-resize; z-index:999999;"></div>
      <div class="resize-handle resize-bottom" style="position:absolute; bottom:-8px; left:0; right:0; height:16px; cursor:s-resize; z-index:999999;"></div>
      <div class="resize-handle resize-left" style="position:absolute; top:0; bottom:0; left:-8px; width:16px; cursor:w-resize; z-index:999999;"></div>
      <div class="resize-handle resize-right" style="position:absolute; top:0; bottom:0; right:-8px; width:16px; cursor:e-resize; z-index:999999;"></div>
      <div class="resize-handle resize-top-left" style="position:absolute; top:-8px; left:-8px; width:22px; height:22px; cursor:nw-resize; z-index:1000000;"></div>
      <div class="resize-handle resize-top-right" style="position:absolute; top:-8px; right:-8px; width:22px; height:22px; cursor:ne-resize; z-index:1000000;"></div>
      <div class="resize-handle resize-bottom-left" style="position:absolute; bottom:-8px; left:-8px; width:22px; height:22px; cursor:sw-resize; z-index:1000000;"></div>
      <div class="resize-handle resize-bottom-right" style="position:absolute; bottom:-8px; right:-8px; width:22px; height:22px; cursor:se-resize; z-index:1000000;"></div>

      <div id="twScannerHeader" style="background:linear-gradient(to bottom, #f4e4bc 0%, #e3c696 100%); border-bottom:1px solid #7d510f; padding:8px 10px; display:flex; justify-content:space-between; align-items:center; cursor:move; user-select:none; flex-shrink:0;">
          <h3 style="margin:0; color:#5b3511; font-size:14px;">🎯 Мега-Сканер + Составление Плана Атак <small style="font-size:10px; color:darkblue">(${version})</small></h3>
          <button class="btn btn-default" onclick="$('#twAdvancedScannerWin').remove();" style="padding:2px 6px; font-weight:bold; background:#d9534f; color:#fff; border:1px solid #b52b27; cursor:pointer;">✕</button>
      </div>

      <div style="padding:10px; flex-grow:1; overflow:hidden; display:flex; flex-direction:column; gap:8px;">
          <div style="background:#fff8e8; border:1px solid #d8c29d; padding:6px 10px; border-radius:4px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:space-between; flex-shrink:0;">
              <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                  <span>Кэш деревень: <b id="twCacheCount" style="color:#8c6723;">${Object.keys(storedVillageList).length}</b></span>
                  <label style="cursor:pointer; font-weight:bold; color:#000;"><input type="checkbox" id="twSelectAllCheckbox"> Выбрать все</label>
                  <label style="cursor:pointer; color:#b71c1c;"><input type="checkbox" id="twHideReservations" ${savedHideReservations?'checked':''}> Убрать бронь</label>
                  <label style="cursor:pointer; color:#7d0f0f;"><input type="checkbox" id="twNobleSearch" ${savedNobleSearch?'checked':''}> Поиск атак дворянином</label>
                  <label style="cursor:pointer; font-weight:bold; color:#5b3511;"><input type="checkbox" id="twFetchCmds" ${savedFetchCmds?'checked':''}> Приказы</label>
                  <label style="cursor:pointer; color:#2e7d32;"><input type="checkbox" id="twShowAttacks" ${savedAttacks?'checked':''}> 🟢 Атаки</label>
                  <label style="cursor:pointer; color:#1565c0;"><input type="checkbox" id="twShowSupports" ${savedSupports?'checked':''}> 🔵 Подкреп</label>
                  <label style="cursor:pointer; color:#b71c1c;"><input type="checkbox" id="twShowReturns" ${savedReturns?'checked':''}> 🟠 Возвраты</label>
              </div>
              <button id="twClearInputsBtn" style="background:#d9534f; color:#fff; border:1px solid #b52b27; padding:2px 8px; cursor:pointer; font-size:10px; font-weight:bold;">🗑️ Очистить выбор</button>
          </div>

          <div style="display:flex; gap:8px; flex-shrink:0;">
              <div style="flex:1;">
                  <label><b>Враги (ники или племена через запятую):</b></label><br>
                  <input type="text" id="twEnemyInput" value="${savedEnemy}" style="width:100%; padding:3px;" placeholder="например: BadGuy, [GO]">
              </div>
              <div style="flex:1;">
                  <label><b>Свои (ники или племена через запятую):</b></label><br>
                  <input type="text" id="twOwnInput" value="${savedOwn}" style="width:100%; padding:3px;" placeholder="например: SOUL, [BK]">
              </div>
          </div>

          <div style="display:flex; gap:8px; flex-shrink:0;">
              <div style="flex:1;">
                  <label><b>Топ ближайших своих:</b></label><br>
                  <input type="number" id="twTopLimit" value="${savedTop}" min="1" max="10" style="width:100%; padding:3px;">
              </div>
              <div style="flex:1;">
                  <label><b>Макс. расстояние (клеток):</b></label><br>
                  <input type="number" id="twMaxDist" value="${savedMaxDist}" placeholder="без лимита" style="width:100%; padding:3px;">
              </div>
          </div>

          <div style="display:flex; gap:6px; flex-shrink:0;">
              <button id="twStartScanBtn" style="flex:2; background:#7d0f0f; color:#fff; border:1px solid #4a0606; padding:6px; cursor:pointer; font-weight:bold;">🚀 Запустить сканирование</button>
              <button id="twMakePlanBtn" style="flex:2; background:#b26a00; color:#fff; border:1px solid #6b3e00; padding:6px; cursor:pointer; font-weight:bold; display:none;">📋 Составить план</button>
              <button id="twCopyTableBtn" style="flex:2; background:#2e7d32; color:#fff; border:1px solid #1b4e1f; padding:6px; cursor:pointer; font-weight:bold; display:none;">📋 Копировать в Таблицы</button>
          </div>

          <!-- Область результатов сканирования -->
          <div id="twScanResults" style="background:#fff; border:1px solid #7d510f; padding:8px; flex-grow:1; overflow-y:auto; border-radius:4px;">
              Настройте цели и нажмите запуск сканирования.
          </div>

          <!-- Окно плана внизу -->
          <div id="twPlanOutputContainer" style="background:#fffde8; border:1px solid #7d510f; padding:8px; display:none; height:180px; flex-shrink:0; display:flex; flex-direction:column; border-radius:4px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; flex-shrink:0;">
                  <b style="color:#5b3511;">📝 Сформированный план атак:</b>
                  <div style="display:flex; gap:6px;">
                      <button id="twCopyPlanBtn" style="background:#2e7d32; color:#fff; border:1px solid #1b4e1f; padding:3px 10px; cursor:pointer; font-weight:bold; font-size:10px;">📋 Копировать план</button>
                      <button id="twClearPlanBtn" style="background:#d9534f; color:#fff; border:1px solid #b52b27; padding:3px 10px; cursor:pointer; font-weight:bold; font-size:10px;">🗑️ Очистить</button>
                  </div>
              </div>
              <textarea id="twPlanOutputText" style="width:100%; flex-grow:1; font-family:monospace; font-size:11px; padding:4px; resize:none; border:1px solid #d8c29d;" readonly></textarea>
          </div>
      </div>
  </div>`;

  $('body').append(panelHtml);
  makeWindowInteractive('twAdvancedScannerWin', 'twScannerHeader');

  window.scannedEnemyData = [];

  function saveStateToStorage() {
    localStorage.setItem(`tw_scanner_enemy_${game_data.world}`, $('#twEnemyInput').val());
    localStorage.setItem(`tw_scanner_own_${game_data.world}`, $('#twOwnInput').val());
    localStorage.setItem(`tw_scanner_top_${game_data.world}`, $('#twTopLimit').val());
    localStorage.setItem(`tw_scanner_maxdist_${game_data.world}`, $('#twMaxDist').val());
    localStorage.setItem(`tw_scanner_fetchcmds_${game_data.world}`, $('#twFetchCmds').is(':checked'));
    localStorage.setItem(`tw_scanner_attacks_${game_data.world}`, $('#twShowAttacks').is(':checked'));
    localStorage.setItem(`tw_scanner_supports_${game_data.world}`, $('#twShowSupports').is(':checked'));
    localStorage.setItem(`tw_scanner_returns_${game_data.world}`, $('#twShowReturns').is(':checked'));
    localStorage.setItem(`tw_scanner_hidereservations_${game_data.world}`, $('#twHideReservations').is(':checked'));
    localStorage.setItem(`tw_scanner_noblesearch_${game_data.world}`, $('#twNobleSearch').is(':checked'));
  }

  $('#twAdvancedScannerWin input').on('input change', function() {
    saveStateToStorage();
    if($(this).attr('id') === 'twHideReservations' || $(this).attr('id') === 'twNobleSearch') {
      renderScanResults();
    }
  });

  $('#twSelectAllCheckbox').change(function() {
    let isChecked = $(this).is(':checked');
    $('#twScanResults').find('.enemy-village-chk, .own-village-chk').prop('checked', isChecked);
  });

  $('#twClearInputsBtn').click(function() {
    $('#twEnemyInput').val('');
    $('#twOwnInput').val('');
    $('#twTopLimit').val('3');
    $('#twMaxDist').val('');
    $('#twFetchCmds').prop('checked', true);
    $('#twShowAttacks').prop('checked', true);
    $('#twShowSupports').prop('checked', true);
    $('#twShowReturns').prop('checked', true);
    $('#twHideReservations').prop('checked', false);
    $('#twNobleSearch').prop('checked', true);
    $('#twSelectAllCheckbox').prop('checked', false);
    localStorage.clear();
    $('#twScanResults').html('Настройки очищены.');
    $('#twMakePlanBtn, #twCopyTableBtn').hide();
    $('#twPlanOutputContainer').hide();
  });

  function renderScanResults() {
    let $resBox = $('#twScanResults');
    if (!window.scannedEnemyData || window.scannedEnemyData.length === 0) {
      $resBox.html('Нет данных сканирования.');
      return;
    }

    let hideReservations = $('#twHideReservations').is(':checked');
    let nobleSearch = $('#twNobleSearch').is(':checked');

    let outputHtml = `<b>📊 Найдено деревень врага: ${window.scannedEnemyData.length}</b><br><br>`;
    let displayedCount = 0;

    window.scannedEnemyData.forEach(item => {
      if (hideReservations && item.isReserved) {
        return;
      }
      if (!nobleSearch && item.hasNobles) {
        return;
      }

      displayedCount++;
      outputHtml += item.htmlBlock;
    });

    if (displayedCount === 0) {
      outputHtml += `<i>Нет целей для отображения по заданным фильтрам.</i>`;
    }

    $resBox.html(outputHtml);
    $('#twSelectAllCheckbox').prop('checked', false);
  }

  // Запуск сканирования
  $('#twStartScanBtn').click(async function(){
    saveStateToStorage();
    let enemyInput = $('#twEnemyInput').val().trim();
    let ownInput = $('#twOwnInput').val().trim();
    let topLimit = parseInt($('#twTopLimit').val(), 10) || 3;
    let maxDistVal = $('#twMaxDist').val().trim();
    let maxDist = maxDistVal !== "" ? parseFloat(maxDistVal) : null;
    
    let fetchCommandsFlag = $('#twFetchCmds').is(':checked');
    let showAttacks = $('#twShowAttacks').is(':checked');
    let showSupports = $('#twShowSupports').is(':checked');
    let showReturns = $('#twShowReturns').is(':checked');

    if(!enemyInput || !ownInput) {
      alert('Заполните поле врагов и поле своих!');
      return;
    }

    let enemyQueries = enemyInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
    let ownQueries = ownInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
    let $resBox = $('#twScanResults');
    
    $resBox.html('🔄 Загрузка данных с сервера игры...');
    $('#twMakePlanBtn, #twCopyTableBtn').hide();
    $('#twPlanOutputContainer').hide();
    window.scannedEnemyData = [];

    let mapBase = location.origin + '/map/';
    let sitterParam = typeof window.sitter_id !== 'undefined' && window.sitter_id ? `t=${window.sitter_id}&` : '';
    let villageParam = game_data.village ? `village=${game_data.village}&` : '';
    let baseGameUrl = `game.php?${sitterParam}${villageParam}`;

    $.when(
      $.get(mapBase + 'player.txt').catch(() => ({responseText: ''})),
      $.get(mapBase + 'village.txt').catch(() => ({responseText: ''})),
      $.get(mapBase + 'ally.txt').catch(() => ({responseText: ''})),
      $.get(baseGameUrl + 'screen=ally&mode=reservations').catch(() => ({responseText: ''}))
    ).done(async function(playerRes, villageRes, allyRes, resRes){
      let pText = playerRes[0] || '';
      let vText = villageRes[0] || '';
      let aText = allyRes[0] || '';
      let resHtml = resRes[0] || '';

      let reservationsMap = {};
      $(resHtml).find('tr[id^="reservation_"]').each(function(){
        let $row = $(this);
        let tds = $row.find('td');
        if(tds.length >= 5) {
          let villageLinkText = tds.eq(0).find('a').first().text();
          let coordMatch = villageLinkText.match(coordinateRegex);
          if(coordMatch) {
            let coord = coordMatch[0];
            let claimantCellText = tds.eq(3).text().replace(/\s+/g, ' ').trim();
            let expires = tds.eq(4).text().trim();
            reservationsMap[coord] = { claimant: claimantCellText, expires: expires };
          }
        }
      });

      let allyTagToId = {};
      aText.split('\n').forEach(line => {
        if(!line.trim()) return;
        let parts = line.split(',');
        if(parts.length >= 3) {
          let allyId = parts[0].trim();
          let rawTag = decodeURIComponent(parts[2].replace(/\+/g, ' ')).trim().toLowerCase();
          let cleanTag = rawTag.replace(/^\[|\]$/g, '');
          allyTagToId[cleanTag] = allyId;
          allyTagToId[rawTag] = allyId;
        }
      });

      let enemyAllies = new Set(), enemyNames = new Set();
      enemyQueries.forEach(q => {
        let cleanQ = q.replace(/^\[|\]$/g, '');
        if(allyTagToId[cleanQ]) enemyAllies.add(allyTagToId[cleanQ]);
        else enemyNames.add(q);
      });

      let ownAllies = new Set(), ownNames = new Set();
      ownQueries.forEach(q => {
        let cleanQ = q.replace(/^\[|\]$/g, '');
        if(allyTagToId[cleanQ]) ownAllies.add(allyTagToId[cleanQ]);
        else ownNames.add(q);
      });

      let enemyPlayerIds = new Set(), ownPlayerIds = new Set(), playersMap = {};
      pText.split('\n').forEach(line => {
        if(!line.trim()) return;
        let parts = line.split(',');
        if(parts.length >= 3) {
          let pId = parts[0].trim();
          let pName = decodeURIComponent(parts[1].replace(/\+/g, ' '));
          let pAllyId = parts[2].trim();
          playersMap[pId] = { name: pName, allyId: pAllyId };
          let lowerName = pName.toLowerCase();

          if(enemyAllies.has(pAllyId) || enemyNames.has(lowerName)) enemyPlayerIds.add(pId);
          if(ownAllies.has(pAllyId) || ownNames.has(lowerName)) ownPlayerIds.add(pId);
        }
      });

      if(enemyPlayerIds.size === 0) {
        $resBox.html('<span style="color:red;">❌ Враги не найдены! Проверьте правильность тегов или ников.</span>');
        return;
      }
      if(ownPlayerIds.size === 0) {
        $resBox.html('<span style="color:red;">❌ Свои не найдены! Проверьте правильность тегов или ников.</span>');
        return;
      }

      let enemyVillages = [];
      vText.split('\n').forEach(line => {
        if(!line.trim()) return;
        let parts = line.split(',');
        if(parts.length >= 5) {
          let vId = parts[0].trim();
          let vName = decodeURIComponent(parts[1].replace(/\+/g, ' '));
          let x = parseInt(parts[2], 10), y = parseInt(parts[3], 10);
          let vPlayerId = parts[4].trim();
          let vObj = { id: vId, name: vName, x: x, y: y, playerId: vPlayerId, coord: x + '|' + y };

          if(enemyPlayerIds.has(vPlayerId)) enemyVillages.push(vObj);
        }
      });

      if(enemyVillages.length === 0) {
        $resBox.html('<span style="color:orange;">⚠️ У найденных врагов нет деревень на карте.</span>');
        return;
      }

      let ownVillagesList = [];
      vText.split('\n').forEach(line => {
        if(!line.trim()) return;
        let parts = line.split(',');
        if(parts.length >= 5 && ownPlayerIds.has(parts[4].trim())) {
          let x = parseInt(parts[2], 10), y = parseInt(parts[3], 10);
          ownVillagesList.push({ id: parts[0].trim(), name: decodeURIComponent(parts[1].replace(/\+/g, ' ')), x: x, y: y, playerId: parts[4].trim(), coord: x+'|'+y });
        }
      });

      for (let ev of enemyVillages) {
        let enemyOwnerObj = playersMap[ev.playerId];
        let enemyPlayerName = enemyOwnerObj ? enemyOwnerObj.name : 'Неизвестно';
        let resInfo = reservationsMap[ev.coord];
        let isReservedFlag = !!resInfo;
        
        let resText = resInfo ? ` <b style="color:red;">[🔒 Бронь: ${resInfo.claimant} до ${resInfo.expires}]</b>` : '';
        let resTableVal = resInfo ? `Забронирован: ${resInfo.claimant} (до ${resInfo.expires})` : "Свободна";

        let villageInfoUrl = `${game_data.link_base_pure}info_village&id=${ev.id}`;

        let blockHtml = `<div style="border-bottom:1px solid #c1a264; padding:6px 0; margin-bottom:6px;" data-target-coord="${ev.coord}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label style="cursor:pointer; font-weight:bold; color:#7d0f0f;">
                <input type="checkbox" class="enemy-village-chk" style="vertical-align:-2px; margin-right:4px;">
                🎯 [Враг: ${enemyPlayerName}] Деревня: ${ev.name} (${ev.coord})
              </label>
              <a href="${villageInfoUrl}" target="_blank" style="background:#8c6723; color:#fff; padding:2px 6px; border-radius:3px; text-decoration:none; font-size:10px; font-weight:bold;" title="Открыть смотр деревни">🔍 Смотр</a>
            </div>
            ${resText}<br>`;

        let distances = ownVillagesList.map(tv => {
          let dist = Math.sqrt(Math.pow(ev.x - tv.x, 2) + Math.pow(ev.y - tv.y, 2));
          let ownOwnerObj = playersMap[tv.playerId];
          return { tv: tv, dist: dist, owner: ownOwnerObj ? ownOwnerObj.name : 'Неизвестно' };
        });

        if(maxDist !== null) distances = distances.filter(item => item.dist <= maxDist);
        distances.sort((a, b) => a.dist - b.dist);
        let topList = distances.slice(0, topLimit);

        if(topList.length === 0) {
          blockHtml += `&nbsp;&nbsp;<i>Нет своих деревень в радиусе.</i><br>`;
        } else {
          topList.forEach((item, idx) => {
            blockHtml += `<div style="display:flex; justify-content:space-between; align-items:center; margin:2px 0 2px 15px; background:#fffcf2; padding:3px 6px; border:1px solid #ebd9b5; border-radius:3px;">
              <label style="cursor:pointer; flex-grow:1;"><input type="checkbox" class="own-village-chk" style="vertical-align:-2px; margin-right:3px;"> ${idx+1}. ${item.tv.name} (${item.tv.coord}) — <b>${item.dist.toFixed(1)} п.</b> (Игрок: ${item.owner})</label>
              <div style="display:flex; gap:6px; align-items:center; font-size:10px;">
                <span>Офф: <input type="number" class="nearby-off-input" value="0" min="0" style="width:45px; text-align:center; padding:1px;"></span>
                <span>Двор: <input type="number" class="nearby-noble-input" value="0" min="0" style="width:35px; text-align:center; padding:1px;"></span>
              </div>
            </div>`;
          });
        }

        let hasNoblesFlag = false;

        if(fetchCommandsFlag) {
          try {
            let infoHtml = await twLib.get({url: villageInfoUrl});
            let commandsTable = $(infoHtml).find('.commands-container');
            
            if(commandsTable.length && commandsTable.find('tr.command-row').length > 0) {
              commandsTable.find('tr th:first').attr('width', '40%').next().attr('width', '20%');
              commandsTable.find('tr:first th:last').after('<th>Дв.</th><th>Офф</th><th>Дефф</th>');

              commandsTable.find('tr.command-row').each(function(){
                let $r = $(this);
                let textContent = $r.text();
                let isSupport = $r.find('img[src*="support"]').length > 0 || textContent.includes('Подкрепление');
                let isReturn = $r.find('img[src*="return_"], img[src*="back"], img[src*="farm"]').length > 0 || textContent.includes('возвращается') || textContent.includes('return');
                
                let isNobleAttack = $r.find('img[src*="unit/snob"], img[src*="snob"]').length > 0;

                if (isNobleAttack) {
                  hasNoblesFlag = true;
                }

                if (isReturn && !showReturns) { $r.remove(); return; }
                if (isSupport && !showSupports) { $r.remove(); return; }
                if (!isSupport && !isReturn && !showAttacks) { $r.remove(); return; }

                let $imgTd = $r.find('td:first');
                let $icon = $imgTd.find('img').first();
                if (isSupport) {
                  if ($icon.length) {
                    $icon.attr('src', $icon.attr('src').replace(/attack[^\/]*\.png/i, 'support.png'));
                  } else {
                    $imgTd.prepend('<img src="/graphic/command/support.png" title="Подкрепление" alt="" style="vertical-align: -2px; margin-right: 3px;" />');
                  }
                }

                $r.append(`
                  <td style="position: relative; padding-bottom: 4px;">
                    <div style="margin-bottom: 2px;"><input class="nobleAmount" style="width: 32px; text-align: center;" type="number" value="${isNobleAttack ? 1 : 0}" min="0"></div>
                  </td>
                  <td style="position: relative; padding-bottom: 4px;">
                    <div style="margin-bottom: 2px;"><input class="offAmount" style="width: 40px; text-align: center;" type="number" value="0" min="0"></div>
                  </td>
                  <td style="position: relative; padding-bottom: 4px;">
                    <div style="margin-bottom: 2px;"><input class="defAmount" style="width: 40px; text-align: center;" type="number" value="0" min="0"></div>
                  </td>
                `);
              });

              if(commandsTable.find('tr.command-row').length > 0) {
                blockHtml += `<div style="margin-top:6px; background:#fffde8; border:1px solid #d8c29d; padding:6px;">
                  <b>Активные приказы и менеджер войск:</b>
                  <table class="vis" style="width:100%; margin-top:4px; background:#fff; border-collapse:collapse;">
                    ${commandsTable.html()}
                  </table>
                </div>`;
              }
            }
          } catch(e) {}
        }

        blockHtml += `</div>`;
        
        window.scannedEnemyData.push({
          coord: ev.coord,
          enemyPlayer: enemyPlayerName,
          enemyName: ev.name,
          reservation: resTableVal,
          isReserved: isReservedFlag,
          hasNobles: hasNoblesFlag,
          htmlBlock: blockHtml
        });
      }

      renderScanResults();

      if(window.scannedEnemyData.length > 0) {
        $('#twMakePlanBtn, #twCopyTableBtn').show();
      }
    }).fail(function(){
      $resBox.html('<span style="color:red;">❌ Ошибка загрузки файлов с сервера игры!</span>');
    });
  });

  // Кнопка «Составить план»
  $('#twMakePlanBtn').click(function(){
    let planLines = [`<b>Параметры плана:</b>\n-----------------------------------`];
    
    let selectedCount = 0;
    $('#twScanResults > div').each(function(){
      let $block = $(this);
      let enemyChk = $block.find('.enemy-village-chk').first();
      if(enemyChk.length && enemyChk.is(':checked')) {
        let enemyText = $block.find('label').first().text().trim();
        planLines.push(`Цель: ${enemyText}`);
        
        $block.find('.own-village-chk').each(function(){
          if($(this).is(':checked')) {
            let container = $(this).closest('div');
            let friendText = container.find('label').text().trim();
            let customOff = container.find('.nearby-off-input').val() || 0;
            let customNoble = container.find('.nearby-noble-input').val() || 0;
            planLines.push(`   ➔ Своя: ${friendText} [Офф: ${customOff}, Двор: ${customNoble}]`);
            selectedCount++;
          }
        });
        planLines.push('');
      }
    });

    if(selectedCount === 0) {
      alert('Не выбрано ни одной деревни (проверьте галочки врагов и своих)!');
      return;
    }

    $('#twPlanOutputText').val(planLines.join('\n'));
    $('#twPlanOutputContainer').show();
    alert('✅ План успешно составлен!');
  });

  // Кнопки управления планом внизу
  $('#twCopyPlanBtn').click(function(){
    let text = $('#twPlanOutputText').val();
    if(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => alert('✅ План скопирован в буфер обмена!'));
      } else {
        let ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        alert('✅ План скопирован в буфер обмена!');
      }
    } else {
      alert('План пуст!');
    }
  });

  $('#twClearPlanBtn').click(function(){
    $('#twPlanOutputText').val('');
    $('#twPlanOutputContainer').hide();
  });

  // Кнопка копирования для Google Таблиц
  $('#twCopyTableBtn').click(function(){
    if(!window.scannedEnemyData || window.scannedEnemyData.length === 0) {
      alert('Нет данных для копирования!');
      return;
    }

    let tsvRows = ["Ник врага\tКоординаты врага\tНазвание врага\tСтатус брони\tКоординаты свои\tНазвание свое\tРасстояние\tИгрок\tОфф\tДвор"];
    let exportedCount = 0;

    $('#twScanResults > div').each(function(){
      let $block = $(this);
      let enemyChk = $block.find('.enemy-village-chk').first();
      
      if(enemyChk.length && enemyChk.is(':checked')) {
        let targetCoord = $block.attr('data-target-coord');
        let enemyData = window.scannedEnemyData.find(d => d.coord === targetCoord);
        
        if(enemyData) {
          $block.find('.own-village-chk').each(function(){
            if($(this).is(':checked')) {
              let container = $(this).closest('div');
              let friendLabelText = container.find('label').text();
              let matchCoord = friendLabelText.match(coordinateRegex);
              
              if(matchCoord) {
                let friendCoord = matchCoord[0];
                let friendName = friendLabelText.split('(')[0].trim().replace(/^\d+\.\s*/, '');
                
                let ownerMatch = friendLabelText.match(/\(Игрок:\s*([^)]+)\)/);
                let friendOwner = ownerMatch ? ownerMatch[1] : 'Неизвестно';
                
                let distMatch = friendLabelText.match(/—\s*<b>([\d.,]+)\s*п\.<\/b>/);
                let distanceVal = distMatch ? distMatch[1] : '';

                let offVal = container.find('.nearby-off-input').val() || '0';
                let nobleVal = container.find('.nearby-noble-input').val() || '0';

                tsvRows.push(`${enemyData.enemyPlayer}\t${enemyData.coord}\t${enemyData.enemyName}\t${enemyData.reservation}\t${friendCoord}\t${friendName}\t${distanceVal}\t${friendOwner}\t${offVal}\t${nobleVal}`);
                exportedCount++;
              }
            }
          });
        }
      }
    });

    if(exportedCount === 0) {
      alert('⚠️ Вы не выбрали ни одной строки галочками для копирования!');
      return;
    }

    let tsvText = tsvRows.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tsvText).then(() => {
        alert(`✅ Успешно скопировано строк: ${exportedCount}! Вставьте их (Ctrl+V) в первую ячейку Google Таблицы.`);
      });
    } else {
      let ta = document.createElement('textarea');
      ta.value = tsvText; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      alert(`✅ Скопировано строк: ${exportedCount}!`);
    }
  });
})();
