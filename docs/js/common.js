// js/common.js
// 共用的 JavaScript 功能

// 載入導航列
document.addEventListener('DOMContentLoaded', function() {
    // 如果頁面沒有導航列，則載入
    if (!document.querySelector('.nav-container') || 
        document.querySelector('.nav-container').innerHTML.trim() === '<!-- 導航列內容 -->') {
        
        // 檢測當前頁面是否在子目錄中
        const isInSubfolder = window.location.pathname.includes('/projects/');
        const pathPrefix = isInSubfolder ? '../' : '';
        
        // 使用 fetch 載入 nav.html
        fetch(`${pathPrefix}components/nav.html`)
            .then(response => response.text())
            .then(navHTML => {
                // 調整路徑
                let adjustedNavHTML = navHTML;
                if (isInSubfolder) {
                    // 如果在子資料夾中，調整所有相對路徑
                    adjustedNavHTML = navHTML
                        .replace(/href="index\.html"/g, `href="${pathPrefix}index.html"`)
                        .replace(/href="street-plan\.html"/g, `href="${pathPrefix}street-plan.html"`)
                        .replace(/href="data\.html"/g, `href="${pathPrefix}data.html"`)
                        .replace(/href="projects\//g, `href="${pathPrefix}projects/`);
                }
                
                // 如果有空的導航列容器，替換內容
                const existingNav = document.querySelector('.nav-container');
                if (existingNav) {
                    existingNav.outerHTML = adjustedNavHTML;
                } else {
                    document.body.insertAdjacentHTML('afterbegin', adjustedNavHTML);
                }
                
                // 添加下拉選單功能
                initDropdown();
            })
            .catch(error => {
                console.error('無法載入導航列:', error);
                // 如果載入失敗，使用備用的硬編碼版本
                loadFallbackNav();
            });
    } else {
        // 如果導航列已存在，直接初始化下拉選單
        initDropdown();
    }
});

// 初始化下拉選單功能
function initDropdown() {
    setTimeout(() => {
        const dropdown = document.querySelector('.dropdown');
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        
        if (dropdown && dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });

            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    }, 100);
}

// 備用導航列（如果 nav.html 載入失敗）
function loadFallbackNav() {
    const isInSubfolder = window.location.pathname.includes('/projects/');
    const pathPrefix = isInSubfolder ? '../' : '';
    
    const navHTML = `
        <nav class="nav-container">
            <a href="${pathPrefix}index.html" class="logo">aka.APPLE 2.0</a>
            <div class="nav-links">
                <a href="${pathPrefix}street-plan.html">Westside Urban Street Plan</a>
                <a href="${pathPrefix}data.html">Data Analysis</a>
                <div class="dropdown">
                    <a href="#" class="dropdown-toggle">
                        Project <i class="fas fa-chevron-down"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a href="${pathPrefix}projects/street-view.html" class="dropdown-item">Street View</a>
                        <a href="${pathPrefix}projects/trash-bin.html" class="dropdown-item">Trash Bin</a>
                        <a href="${pathPrefix}projects/dining-area.html" class="dropdown-item">Dinning Area</a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    const existingNav = document.querySelector('.nav-container');
    if (existingNav) {
        existingNav.outerHTML = navHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    
    initDropdown();
}

// 圖片比較功能
function initComparison(container) {
    const before = container.querySelector('.before');
    const slider = container.querySelector('.slider');
    const line = container.querySelector('.slider-line');
    const handle = container.querySelector('.slider-handle');
    const beforeLabel = container.querySelector('.before-label');
    const afterLabel = container.querySelector('.after-label');
    
    const update = v => {
        before.style.clipPath = `inset(0 ${100-v}% 0 0)`;
        line.style.left = handle.style.left = v+'%';
        
        if (v > 70) {
            beforeLabel.style.opacity = '1';
            afterLabel.style.opacity = '0';
        } else if (v < 60) {
            beforeLabel.style.opacity = '0';
            afterLabel.style.opacity = '1';
        } else {
            beforeLabel.style.opacity = '0';
            afterLabel.style.opacity = '0';
        }
    };
    
    slider.addEventListener('input', e => update(e.target.value));
    update(90);
}

// 初始化所有圖片比較容器
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.image-comparison').forEach(initComparison);
    
    // 初始化 problem 頁面的按鈕功能
    initProblemButtons();
    
    // 初始化照片展示功能
    initPhotoGallery();
});

// Problem 頁面按鈕功能
function initProblemButtons() {
    // 為所有 solution 按鈕添加點擊事件
    document.querySelectorAll('.solution-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-target');
            
            // 根據按鈕的 data-target 屬性跳轉到對應頁面
            switch(targetPage) {
                case '8':
                    window.location.href = 'projects/street-view.html';
                    break;
                case '13':
                    window.location.href = 'projects/trash-bin.html';
                    break;
                case '14':
                    window.location.href = 'projects/dining-area.html';
                    break;
                default:
                    console.log('未知的目標頁面:', targetPage);
            }
        });
    });
}

// 照片展示功能
function initPhotoGallery() {
    // 創建燈箱元素
    createLightbox();
    
    // 為所有照片項目添加點擊事件
    document.querySelectorAll('.photo-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.photo-overlay');
            
            if (img && overlay) {
                openLightbox(img.src, overlay.querySelector('h3').textContent, overlay.querySelector('p').textContent);
            }
        });
    });
}

// 創建燈箱
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-info">
                <h3 class="lightbox-title"></h3>
                <p class="lightbox-description"></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // 添加關閉事件
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    // 點擊背景關閉
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // ESC 鍵關閉
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// 開啟燈箱
function openLightbox(imageSrc, title, description) {
    const lightbox = document.querySelector('.lightbox');
    const image = lightbox.querySelector('.lightbox-image');
    const titleElement = lightbox.querySelector('.lightbox-title');
    const descElement = lightbox.querySelector('.lightbox-description');
    
    image.src = imageSrc;
    titleElement.textContent = title;
    descElement.textContent = description;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 關閉燈箱
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}
