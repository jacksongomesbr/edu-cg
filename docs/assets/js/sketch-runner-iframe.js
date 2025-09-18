/* docs/assets/js/sketch-runner-iframe.js */

(function() {
    'use strict';

    // Configurações
    const CONFIG = {
        p5Version: '1.11.8',
        p5CDN: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.8/p5.min.js',
        defaultTimeout: 30000
    };

    // Template HTML para o iframe (modo sketch)
    const createSketchHTML = (data, resources) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'P5.js Sketch'}</title>
    <script src="${CONFIG.p5CDN}"></script>
    
    ${resources.fonts.map(font => 
        `<link href="${font}" rel="stylesheet">`
    ).join('\n    ')}
    
    ${resources.css.map(css => 
        `<style>${css}</style>`
    ).join('\n    ')}
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: transparent;
        }
        body {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            position: relative;
        }
        main {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
        }
        canvas {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }
    </style>
</head>
<body>
    <main></main>
    
    ${resources.js.map(js => 
        `<script>${js}</script>`
    ).join('\n    ')}
    
    <script>
        // Notify parent when canvas is ready
        function notifyCanvasReady() {
            const canvas = document.querySelector('canvas');
            if (canvas && canvas.width && canvas.height) {
                window.parent.postMessage({
                    type: 'canvasReady',
                    width: canvas.width,
                    height: canvas.height
                }, '*');
                return true;
            }
            return false;
        }
        
        // Check for canvas periodically
        let checkCount = 0;
        const checkInterval = setInterval(() => {
            if (notifyCanvasReady() || checkCount++ > 100) {
                clearInterval(checkInterval);
            }
        }, 50);
        
        // Also check when draw loop starts
        if (typeof draw === 'function') {
            const originalDraw = draw;
            let notified = false;
            draw = function() {
                if (!notified) {
                    notified = notifyCanvasReady();
                }
                return originalDraw.apply(this, arguments);
            };
        }
    </script>
</body>
</html>`;

    // Função para criar ícones SVG
    function createIcon(type) {
        const icons = {
            play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M8 5v14l11-7z"/>
                   </svg>`,
            pause: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>`,
            refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                      </svg>`,
            external: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M15 3h6v6"/>
                         <path d="M10 14 21 3"/>
                         <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                       </svg>`
        };
        return icons[type] || '';
    }

    class SketchRunnerIframe {
        constructor(data) {
            this.data = data;
            this.iframe = null;
            this.sketchCode = null;
            this.isRunning = !data.pauseAtBeginning;
            this.isLoaded = false;
            this.loadingTimeout = null;
            
            // Bind methods
            this.handleLoad = this.handleLoad.bind(this);
            this.reset = this.reset.bind(this);
            this.toggleRunning = this.toggleRunning.bind(this);
            this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
            this.handleCanvasMessage = this.handleCanvasMessage.bind(this);
            
            this.element = this.createElement();
            this.init();
        }

        async init() {
            try {
                await this.loadSketch();
                this.createIframe();
                this.setupIntersectionObserver();
                this.setupMessageListener();
            } catch (error) {
                this.showError('Erro ao carregar o sketch');
            }
        }

        async loadSketch() {
            // Modo HTML: carregar index.html completo
            if (this.data.htmlPath) {
                               
                try {
                    const response = await fetch(this.data.htmlPath);
                    if (!response.ok) {
                        throw new Error(`Failed to load HTML: ${response.status} - ${response.statusText}`);
                    }
                    this.htmlContent = await response.text();
                    return;
                } catch (fetchError) {
                    throw new Error(`Erro ao carregar HTML: ${fetchError.message}`);
                }
            }
            
            // Modo sketch: carregar múltiplos recursos
            if (!this.data.sketchPath) {
                throw new Error('Either sketch-path or html-path is required');
            }

            this.resources = {
                js: [],
                css: [],
                fonts: []
            };

            // Carregar arquivo principal do sketch
            const sketchResponse = await fetch(this.data.sketchPath);
            if (!sketchResponse.ok) {
                throw new Error(`Failed to load sketch: ${sketchResponse.status}`);
            }
            const mainSketch = await sketchResponse.text();
            this.resources.js.push(mainSketch);

            // Carregar arquivos JS auxiliares
            if (this.data.jsFiles) {
                const jsFiles = this.data.jsFiles.split(',').map(f => f.trim());
                for (const jsFile of jsFiles) {
                    try {
                        const response = await fetch(jsFile);
                        if (response.ok) {
                            const content = await response.text();
                            this.resources.js.unshift(content); // Auxiliares primeiro
                        }
                    } catch (error) {
                        console.warn(`Failed to load JS file ${jsFile}:`, error);
                    }
                }
            }

            // Carregar arquivos CSS
            if (this.data.cssFiles) {
                const cssFiles = this.data.cssFiles.split(',').map(f => f.trim());
                for (const cssFile of cssFiles) {
                    try {
                        const response = await fetch(cssFile);
                        if (response.ok) {
                            const content = await response.text();
                            this.resources.css.push(content);
                        }
                    } catch (error) {
                        console.warn(`Failed to load CSS file ${cssFile}:`, error);
                    }
                }
            }

            // Processar fontes (URLs diretas)
            if (this.data.fontUrls) {
                this.resources.fonts = this.data.fontUrls.split(',').map(f => f.trim());
            }
        }

        createIframe() {
            const container = this.element.querySelector('.canvas-container');
            
            this.iframe = document.createElement('iframe');
            this.iframe.className = 'sketch-iframe';
            this.iframe.title = this.data.title || 'P5.js Sketch';
            this.iframe.sandbox = 'allow-scripts allow-same-origin';
            this.iframe.loading = 'lazy';
            
            // Set timeout for loading
            this.loadingTimeout = setTimeout(() => {
                if (!this.isLoaded) {
                    this.showError('Timeout ao carregar sketch');
                }
            }, CONFIG.defaultTimeout);

            this.iframe.addEventListener('load', this.handleLoad);
            
            // Create iframe content based on mode
            let htmlContent;
            
            if (this.htmlContent) {
                // Modo HTML: resolver URLs relativas e injetar script de detecção de canvas
                let resolvedContent = this.resolveRelativeUrls(this.htmlContent);
                htmlContent = this.injectCanvasDetection(resolvedContent);
            } else if (this.resources) {
                // Modo sketch: gerar HTML com recursos
                htmlContent = createSketchHTML(this.data, this.resources);
            } else {
                throw new Error('No content to create iframe with');
            }
            
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            this.iframe.src = url;
            container.appendChild(this.iframe);
        }

        handleLoad() {
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
                this.loadingTimeout = null;
            }

            // Initial load complete - canvas sizing will be handled by postMessage
            
            // Set a timeout to detect if canvas is never created
            this.canvasTimeout = setTimeout(() => {
                if (!this.isLoaded) {
                    console.warn('Canvas not detected after 10 seconds, checking iframe content...');
                    this.debugIframeContent();
                }
            }, 10000);
        }

        handleCanvasMessage(event) {
            // Only accept messages from our iframe and only canvas-related messages
            if (!this.iframe || event.source !== this.iframe.contentWindow) {
                return; // Silently ignore messages from other sources
            }
            
            // Only process messages we care about
            if (!event.data || typeof event.data !== 'object' || event.data.type !== 'canvasReady') {
                return;
            }
            
            
            const { width, height } = event.data;
            
            // Clear canvas timeout since we found the canvas
            if (this.canvasTimeout) {
                clearTimeout(this.canvasTimeout);
                this.canvasTimeout = null;
            }
            
            this.adjustIframe({ width, height });
            this.setLoaded(true);
            
            // Iframe is now ready and positioned
            
            // Apply initial pause if needed
            if (this.data.pauseAtBeginning) {
                setTimeout(() => this.pause(), 200);
            }
        }

        setupMessageListener() {
            window.addEventListener('message', this.handleCanvasMessage);
        }

        debugIframeContent() {
            try {
                const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
                if (iframeDoc) {
                    const canvas = iframeDoc.querySelector('canvas');
                    
                    const scripts = iframeDoc.querySelectorAll('script');
                    
                    const errors = iframeDoc.querySelectorAll('.error, [class*="error"]');
                    
                    // Check for p5.js
                    const p5Loaded = this.iframe.contentWindow.p5;
                    
                    // Check for setup/draw functions
                    const setupFn = this.iframe.contentWindow.setup;
                    const drawFn = this.iframe.contentWindow.draw;
                } else {
                    console.error('Cannot access iframe document (CORS issue)');
                }
            } catch (error) {
                console.error('Error debugging iframe content:', error);
            }
        }

        resolveRelativeUrls(htmlContent) {
            // Convert relative URLs to absolute URLs based on the original HTML path
            const baseUrl = this.data.htmlPath.substring(0, this.data.htmlPath.lastIndexOf('/') + 1);
            
            let resolvedContent = htmlContent;
            
            // Fix script src attributes
            resolvedContent = resolvedContent.replace(/src="([^"]*?)"/g, (match, src) => {
                if (src.startsWith('http') || src.startsWith('//') || src.startsWith('/')) {
                    return match; // Already absolute
                }
                const absoluteUrl = baseUrl + src;
                return `src="${absoluteUrl}"`;
            });
            
            // Fix link href attributes  
            resolvedContent = resolvedContent.replace(/href="([^"]*?)"/g, (match, href) => {
                if (href.startsWith('http') || href.startsWith('//') || href.startsWith('/') || href.startsWith('#')) {
                    return match; // Already absolute or anchor
                }
                const absoluteUrl = baseUrl + href;
                return `href="${absoluteUrl}"`;
            });
            
            return resolvedContent;
        }

        injectCanvasDetection(htmlContent) {
            const canvasDetectionScript = `
                <script>
                    function notifyCanvasReady() {
                        // Debug all elements
                        
                        const canvas = document.querySelector('canvas');
                        if (canvas) {
                            if (canvas.width && canvas.height) {
                                window.parent.postMessage({
                                    type: 'canvasReady',
                                    width: canvas.width,
                                    height: canvas.height
                                }, '*');
                                return true;
                            }
                        }
                                              
                        return false;
                    }
                    
                    // Simple but aggressive detection
                    let attempts = 0;
                    const maxAttempts = 400; // 10 seconds at 25ms intervals
                    
                    const checkInterval = setInterval(() => {
                        attempts++;
                        
                        if (notifyCanvasReady()) {
                            clearInterval(checkInterval);
                        } else if (attempts >= maxAttempts) {
                            console.warn('Canvas detection timeout after', attempts, 'attempts');
                            clearInterval(checkInterval);
                        }
                    }, 25);
                    
                    // Also try after load events
                    window.addEventListener('load', () => {
                        setTimeout(notifyCanvasReady, 100);
                        setTimeout(notifyCanvasReady, 500);
                        setTimeout(notifyCanvasReady, 1000);
                    });
                    
                    // And after DOM ready
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', () => {
                            setTimeout(notifyCanvasReady, 100);
                        });
                    } else {
                        setTimeout(notifyCanvasReady, 100);
                    }
                </script>
            `;

            // Injetar antes do fechamento do body
            if (htmlContent.includes('</body>')) {
                return htmlContent.replace('</body>', canvasDetectionScript + '\n</body>');
            } else {
                // Fallback: adicionar no final
                return htmlContent + canvasDetectionScript;
            }
        }

        adjustIframe(canvas) {
            // Check if custom dimensions are specified via data attributes
            let targetWidth = this.data.width ? parseInt(this.data.width) : canvas.width;
            let targetHeight = this.data.height ? parseInt(this.data.height) : canvas.height;
            
            // Fallback: if canvas is too large, use reasonable defaults
            if (!this.data.width && !this.data.height) {
                const maxReasonableWidth = 800;
                const maxReasonableHeight = 600;
                
                if (canvas.width > maxReasonableWidth || canvas.height > maxReasonableHeight) {
                    const scaleX = maxReasonableWidth / canvas.width;
                    const scaleY = maxReasonableHeight / canvas.height;
                    const scale = Math.min(scaleX, scaleY);
                    
                    targetWidth = Math.floor(canvas.width * scale);
                    targetHeight = Math.floor(canvas.height * scale);
                }
            }
            
            // Set iframe dimensions
            this.iframe.style.width = `${targetWidth}px`;
            this.iframe.style.height = `${targetHeight}px`;
            this.iframe.style.border = 'none';
            this.iframe.style.display = 'block';
            this.iframe.style.overflow = 'hidden';
            
            // Container should match iframe
            const container = this.element.querySelector('.canvas-container');
            container.style.width = `${targetWidth}px`;
            container.style.height = `${targetHeight}px`;
            container.style.overflow = 'hidden';
            container.style.position = 'relative';
            
            // Center the entire component
            this.element.style.width = 'fit-content';
            this.element.style.margin = '2rem auto';
            this.element.style.display = 'block';
            
            // Log dimensions for debugging
        }

        reset() {
            this.setLoaded(false);
            this.setIsRunning(true);
            
            if (this.iframe) {
                // Reload iframe
                const currentSrc = this.iframe.src;
                this.iframe.src = '';
                setTimeout(() => {
                    this.iframe.src = currentSrc;
                }, 100);
            }
        }

        toggleRunning() {
            this.setIsRunning(!this.isRunning);
            this.isRunning ? this.resume() : this.pause();
        }

        pause() {
            if (!this.iframe) return;
            
            try {
                const p5Window = this.iframe.contentWindow;
                if (p5Window && p5Window.frameRate) {
                    p5Window.frameRate(0);
                }
            } catch (error) {
                console.warn('Cannot pause sketch:', error);
            }
        }

        resume() {
            if (!this.iframe) return;
            
            try {
                const p5Window = this.iframe.contentWindow;
                if (p5Window && p5Window.frameRate) {
                    p5Window.frameRate(60); // Default framerate
                }
            } catch (error) {
                console.warn('Cannot resume sketch:', error);
            }
        }

        setLoaded(loaded) {
            this.isLoaded = loaded;
            const loadingText = this.element.querySelector('.loading-text');
            const iframe = this.element.querySelector('.sketch-iframe');
            const statusIndicator = this.element.querySelector('.status-indicator');
            
            if (loaded) {
                if (loadingText) loadingText.classList.add('hidden');
                if (iframe) {
                    iframe.classList.remove('opacity-0');
                    iframe.classList.add('opacity-100');
                }
                if (statusIndicator) {
                    statusIndicator.classList.remove('error');
                }
                this.element.classList.remove('loading');
            } else {
                if (loadingText) loadingText.classList.remove('hidden');
                if (iframe) {
                    iframe.classList.add('opacity-0');
                    iframe.classList.remove('opacity-100');
                }
                this.element.classList.add('loading');
            }
        }

        setIsRunning(running) {
            this.isRunning = running;
            this.updateControls();
        }

        updateControls() {
            const playPauseBtn = this.element.querySelector('.play-pause-btn');
            const statusIndicator = this.element.querySelector('.status-indicator');
            
            if (playPauseBtn) {
                const icon = playPauseBtn.querySelector('.icon');
                const text = playPauseBtn.querySelector('.button-text');
                
                if (this.isRunning) {
                    if (icon) icon.innerHTML = createIcon('pause');
                    if (text) text.textContent = 'Pause';
                    playPauseBtn.title = 'Pausar sketch';
                } else {
                    if (icon) icon.innerHTML = createIcon('play');
                    if (text) text.textContent = 'Play';
                    playPauseBtn.title = 'Reproduzir sketch';
                }
            }
            
            if (statusIndicator) {
                statusIndicator.classList.toggle('paused', !this.isRunning);
                statusIndicator.title = this.isRunning ? 'Executando' : 'Pausado';
            }
        }

        showError(message) {
            const loadingText = this.element.querySelector('.loading-text');
            const statusIndicator = this.element.querySelector('.status-indicator');
            
            console.error('Sketch Runner Error:', message);
            
            if (loadingText) {
                loadingText.innerHTML = `
                    <span style="color: #ef4444; font-weight: bold;">❌ Erro</span><br>
                    <span style="color: #666; font-size: 12px;">${message}</span>
                `;
                loadingText.classList.remove('hidden');
            }
            
            if (statusIndicator) {
                statusIndicator.classList.add('error');
                statusIndicator.title = `Erro: ${message}`;
            }
            
            this.element.classList.remove('loading');
        }

        setupIntersectionObserver() {
            if (!this.iframe) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (this.isLoaded && this.isRunning) {
                        if (entry.isIntersecting) {
                            this.resume();
                        } else {
                            this.pause();
                        }
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(this.iframe);
            this.intersectionObserver = observer;
        }

        handleVisibilityChange() {
            if (document.hidden && this.isRunning) {
                this.pause();
            } else if (!document.hidden && this.isRunning) {
                this.resume();
            }
        }

        createElement() {
            const container = document.createElement('div');
            container.className = 'sketch-runner-component loading';
            
            container.innerHTML = `
                <div class="sketch-canvas-wrapper">
                    <div class="status-indicator ${this.isRunning ? '' : 'paused'}" 
                         title="${this.isRunning ? 'Executando' : 'Pausado'}"></div>
                    <div class="loading-text">
                        <span>Carregando sketch...</span>
                    </div>
                    <div class="canvas-container"></div>
                </div>

                <div class="controls">
                    <div class="controls-left">
                        <button class="control-btn reset-btn" title="Reiniciar sketch">
                            <span class="icon">${createIcon('refresh')}</span>
                            <span class="reset-text button-text">Reset</span>
                        </button>
                        
                        <button class="control-btn play-pause-btn" title="${this.isRunning ? 'Pausar' : 'Reproduzir'} sketch">
                            <span class="icon">${createIcon(this.isRunning ? 'pause' : 'play')}</span>
                            <span class="play-pause-text button-text">${this.isRunning ? 'Pause' : 'Play'}</span>
                        </button>
                    </div>

                    ${this.data.editorUrl ? `
                    <a href="${this.data.editorUrl}" target="_blank" rel="noopener noreferrer"
                       class="editor-link-container" title="Abrir no Editor Web do P5.js">
                        <span class="editor-link">Abrir no Editor Web</span>
                        <span class="icon">${createIcon('external')}</span>
                    </a>
                    ` : ''}
                </div>
            `;

            // Add event listeners
            const resetBtn = container.querySelector('.reset-btn');
            const playPauseBtn = container.querySelector('.play-pause-btn');
            
            if (resetBtn) resetBtn.addEventListener('click', this.reset);
            if (playPauseBtn) playPauseBtn.addEventListener('click', this.toggleRunning);
            
            // Listen for visibility changes
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            
            return container;
        }

        destroy() {
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }
            
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
            }
            
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            window.removeEventListener('message', this.handleCanvasMessage);
            
            if (this.iframe && this.iframe.src) {
                URL.revokeObjectURL(this.iframe.src);
            }
            
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }

        getElement() {
            return this.element;
        }
    }

    // Initialize all sketch runners
    function initializeSketchRunners() {
        const elements = document.querySelectorAll('.sketch-runner:not(.initialized)');
        
        elements.forEach(element => {
            const data = {
                sketchPath: element.getAttribute('data-sketch-path'),
                htmlPath: element.getAttribute('data-html-path'),
                jsFiles: element.getAttribute('data-js-files'),
                cssFiles: element.getAttribute('data-css-files'),
                fontUrls: element.getAttribute('data-font-urls'),
                title: element.getAttribute('data-title') || 'P5.js Sketch',
                editorUrl: element.getAttribute('data-editor-url'),
                pauseAtBeginning: element.getAttribute('data-pause-at-beginning') === 'true',
                width: element.getAttribute('data-width'),
                height: element.getAttribute('data-height')
            };
            
            if (!data.sketchPath && !data.htmlPath) {
                console.warn('Missing data-sketch-path or data-html-path attribute');
                element.innerHTML = '<p style="color: red;">❌ Erro: data-sketch-path ou data-html-path é obrigatório</p>';
                return;
            }
            
            try {
                const runner = new SketchRunnerIframe(data);
                element.classList.add('initialized');
                element.parentNode.replaceChild(runner.getElement(), element);
                runner.getElement().sketchRunner = runner;
            } catch (error) {
                console.error('Error initializing sketch runner:', error);
                element.innerHTML = '<p style="color: red;">❌ Erro ao inicializar</p>';
            }
        });
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSketchRunners);
    } else {
        initializeSketchRunners();
    }

    // Export for manual initialization
    window.SketchRunnerIframe = {
        init: initializeSketchRunners,
        create: (data) => new SketchRunnerIframe(data)
    };

})();