// js/map.js
// 地圖相關的共用功能

// 地圖初始化函數
function initializeMap(containerId, options = {}) {
    const defaultOptions = {
        center: [25.04677, 121.51187],
        zoom: 13,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        zoomControl: false,
        keyboard: false,
        attributionControl: true,
        interactive: true
    };

    const mapOptions = { ...defaultOptions, ...options };
    const map = L.map(containerId, mapOptions);

    // 添加地圖圖層
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO'
    }).addTo(map);

    // 在初始化後立即設定視圖，確保中心點正確
    map.setView([25.04677, 121.51187], 13);

    return map;
}

// 創建熱力圖層函數
function createHeatmapLayer(data, options = {}) {
    const defaultOptions = {
        radius: 10,
        blur: 14,
        maxZoom: 18,
        minOpacity: 0.3,
        gradient: {0.2: '#00ffff', 0.4: '#00ff00', 0.6: '#ffff00', 0.8: '#ff0000'}
    };

    const heatOptions = { ...defaultOptions, ...options };
    const heatData = [];
    
    Object.keys(data).forEach(type => {
        data[type].forEach(f => {
            heatData.push([f.geometry.coordinates[1], f.geometry.coordinates[0], 1]);
        });
    });
    
    return L.heatLayer(heatData, heatOptions);
}

// 創建點位圖層函數
function createPointLayers(data, colors) {
    const layers = {};
    
    Object.keys(data).forEach(type => {
        const g = L.layerGroup();
        data[type].forEach(f => {
            L.circleMarker([f.geometry.coordinates[1], f.geometry.coordinates[0]], {
                radius: 6,
                fillColor: colors[type],
                color: colors[type],
                weight: 0,
                fillOpacity: 1
            }).addTo(g);
        });
        layers[type] = g;
    });
    
    return layers;
}

// 確保地圖可拖曳的函數
function enableMapDragging(map) {
    map.dragging.enable();
    map.getContainer().style.cursor = 'grab';
    
    // 移除可能的事件攔截
    map.getContainer().addEventListener('mousedown', function(e) {
        e.stopPropagation();
    });
}
