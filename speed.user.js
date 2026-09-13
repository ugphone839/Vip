// ==UserScript==
// @name         Global Speed Hack (Toggle Button)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const SPEED_FACTOR = 1000;
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    let isSpeedActive = false;
    let isMinimized = true;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // --- Chức năng Tăng Tốc ---
    function applySpeedHack() {
        window.setTimeout = function(fn, t) {
            const newDelay = Math.max(0.1, t / SPEED_FACTOR);
            return originalSetTimeout(fn, newDelay);
        };
        window.setInterval = function(fn, t) {
            const newDelay = Math.max(0.1, t / SPEED_FACTOR);
            return originalSetInterval(fn, newDelay);
        };
        isSpeedActive = true;
    }

    function removeSpeedHack() {
        window.setTimeout = originalSetTimeout;
        window.setInterval = originalSetInterval;
        isSpeedActive = false;
    }

    // --- Quản lý Giao diện ---
    const container = document.createElement('div');
    container.id = 'speed-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999999';
    container.style.cursor = 'move';

    // --- Tính năng kéo thả ---
    container.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', duringDrag);
    document.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
        if (e.target === container || e.target === minimizeButton) {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            container.style.opacity = '0.8';
        }
    }

    function duringDrag(e) {
        if (!isDragging) return;

        container.style.left = (e.clientX - dragOffsetX) + 'px';
        container.style.right = 'auto';
        container.style.top = (e.clientY - dragOffsetY) + 'px';
    }

    function stopDrag() {
        isDragging = false;
        container.style.opacity = '1';
    }

    // 2. Tạo nút thu nhỏ
    const minimizeButton = document.createElement('button');
    minimizeButton.id = 'minimize-button';
    minimizeButton.textContent = '+';
    minimizeButton.style.width = '30px';
    minimizeButton.style.height = '30px';
    minimizeButton.style.borderRadius = '50%';
    minimizeButton.style.border = 'none';
    minimizeButton.style.backgroundColor = '#3498db';
    minimizeButton.style.color = 'white';
    minimizeButton.style.fontSize = '20px';
    minimizeButton.style.lineHeight = '0';
    minimizeButton.style.cursor = 'pointer';

    // 3. Tạo nút SPEED
    const speedButton = document.createElement('button');
    speedButton.id = 'speed-toggle-button';
    speedButton.textContent = 'SPEED x1000 (OFF)';
    speedButton.style.padding = '8px 12px';
    speedButton.style.border = 'none';
    speedButton.style.borderRadius = '5px';
    speedButton.style.cursor = 'pointer';
    speedButton.style.color = 'white';
    speedButton.style.backgroundColor = '#cc2a35';
    speedButton.style.marginRight = '5px';
    speedButton.style.display = 'none';

    // --- Logic Toggle Speed ---
    function toggleSpeed() {
        if (isSpeedActive) {
            removeSpeedHack();
            speedButton.textContent = 'SPEED x1000 (OFF)';
            speedButton.style.backgroundColor = '#cc2a35';
        } else {
            applySpeedHack();
            speedButton.textContent = 'SPEED x1000 (ON)';
            speedButton.style.backgroundColor = '#2ecc71';
        }
    }

    // --- Logic Ẩn/Hiện ---
    function toggleMinimize() {
        if (isMinimized) {
            speedButton.style.display = 'inline-block';
            minimizeButton.textContent = '−';
            isMinimized = false;
        } else {
            speedButton.style.display = 'none';
            minimizeButton.textContent = '+';
            isMinimized = true;
        }
    }

    // --- Gắn Sự kiện và Nút vào DOM ---
    speedButton.addEventListener('click', toggleSpeed);
    minimizeButton.addEventListener('click', toggleMinimize);

    container.appendChild(speedButton);
    container.appendChild(minimizeButton);
    document.body.appendChild(container);

})();
