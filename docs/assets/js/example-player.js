/* docs/assets/js/example-player.js */

(function() {
    'use strict';

    // Constante para altura máxima do embed
    const EMBED_MAX_HEIGHT = 400;

    // Função debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Função para criar ícones SVG
    function createIcon(type) {
        const icons = {
            play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <polygon points="5,3 19,12 5,21"></polygon>
                   </svg>`,
            pause: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>`,
            refresh: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="23,4 23,10 17,10"></polyline>
                        <path d="M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4v6h-6m-2.99-3A9 9 0 0 1 18.36 18.36L23 14"></path>
                      </svg>`,
            external: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                         <polyline points="15,3 21,3 21,9"></polyline>
                         <line x1="10" y1="14" x2="21" y2="3"></line>
                       </svg>`
        };
        return icons[type] || '';
    }

    // Classe principal do componente Example
    class Example {
        constructor(data) {
            this.data = data;
            this.ref = null;
            this.loaded = false;
            this.isRunning = !data.pauseAtBeginning;
            this.aspectRatio = null; // Will be set when canvas is detected
            this.canvasWidth = 400;
            this.pausedFrameRate = 0;
            this.intersectionObserver = null;
            
            // Bind dos métodos
            this.handleLoad = this.handleLoad.bind(this);
            this.reset = this.reset.bind(this);
            this.toggleRunning = this.toggleRunning.bind(this);
            this.pause = this.pause.bind(this);
            this.resume = this.resume.bind(this);
            this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 500);
            
            this.element = this.createElement();
            this.setupEventListeners();
        }

        adjustFrame(canvas) {
            this.aspectRatio = canvas.width / canvas.height;
            this.canvasWidth = canvas.width;
            this.ref.style.aspectRatio = `${this.aspectRatio}`;
            
            // Update container max-width based on new aspect ratio
            const container = this.element.querySelector('.example-component');
            if (container) {
                container.style.maxWidth = `${EMBED_MAX_HEIGHT * this.aspectRatio}px`;
            }
            
            this.setLoaded(true);
        }

        handleLoad() {
            if (this.ref) {
                const p5Window = this.ref.contentWindow;
                if (!p5Window) return;

                try {
                    p5Window.document.body.style.margin = '0';
                    p5Window.document.body.style.overflow = 'hidden';

                    const p5Canvas = p5Window.document.querySelector('canvas');

                    if (this.data.pauseAtBeginning || !this.isRunning) {
                        const nextFrameCallback = () => {
                            const currentFrameRate = p5Window.getFrameRate?.();
                            if (currentFrameRate && currentFrameRate > 0) {
                                this.pause();
                                this.setIsRunning(false);
                            } else {
                                window.requestAnimationFrame(nextFrameCallback);
                            }
                        };
                        window.requestAnimationFrame(nextFrameCallback);
                    }

                    if (p5Canvas) {
                        this.adjustFrame(p5Canvas);
                    } else {
                        const setupFunc = p5Window.setup;
                        if (setupFunc) {
                            p5Window.setup = () => {
                                setupFunc();
                                const canvas = p5Window.document.querySelector('canvas');
                                if (canvas) this.adjustFrame(canvas);
                            };
                        }
                    }
                } catch (error) {
                    console.warn('Error accessing iframe content:', error);
                    // Fallback: assume sketch is loaded
                    this.setLoaded(true);
                }
            }
        }

        reset() {
            if (!this.ref) return;
            try {
                const p5Window = this.ref.contentWindow;
                if (p5Window) {
                    p5Window.location.reload();
                    this.setIsRunning(true);
                }
            } catch (error) {
                console.warn('Error resetting sketch:', error);
                // Fallback: reload iframe src
                const currentSrc = this.ref.src;
                this.ref.src = '';
                setTimeout(() => {
                    this.ref.src = currentSrc;
                }, 100);
            }
        }

        toggleRunning() {
            if (this.isRunning) {
                this.pause();
                this.setIsRunning(false);
            } else {
                this.resume();
                this.setIsRunning(true);
            }
        }

        pause() {
            if (!this.ref) return;
            try {
                const p5Window = this.ref.contentWindow;
                if (!p5Window) return;

                const currentFrameRate = p5Window.getFrameRate?.();
                if (currentFrameRate && currentFrameRate > 0 && p5Window.frameRate) {
                    this.pausedFrameRate = currentFrameRate;
                    p5Window.frameRate(0);
                }
            } catch (error) {
                console.warn('Error pausing sketch:', error);
            }
        }

        resume() {
            if (!this.ref) return;
            try {
                const p5Window = this.ref.contentWindow;
                if (!p5Window) return;

                if (p5Window.frameRate) {
                    // Resume with saved frame rate or default to 60fps
                    const resumeFrameRate = this.pausedFrameRate > 0 ? this.pausedFrameRate : 60;
                    p5Window.frameRate(resumeFrameRate);
                }
            } catch (error) {
                console.warn('Error resuming sketch:', error);
            }
        }

        handleWindowResize() {
            if (this.ref) {
                this.canvasWidth = this.ref.offsetWidth;
                this.updateButtonLabels();
                
                // Update container max-width on resize
                const container = this.element.querySelector('.example-component');
                if (container && this.aspectRatio) {
                    container.style.maxWidth = `${EMBED_MAX_HEIGHT * this.aspectRatio}px`;
                }
            }
        }

        setLoaded(loaded) {
            this.loaded = loaded;
            const loadingDiv = this.element.querySelector('.loading-text');
            const iframe = this.element.querySelector('iframe');
            
            if (loaded) {
                if (loadingDiv) loadingDiv.classList.add('hidden');
                if (iframe) {
                    iframe.classList.remove('opacity-0');
                    iframe.classList.add('opacity-100');
                }
            } else {
                if (loadingDiv) loadingDiv.classList.remove('hidden');
                if (iframe) {
                    iframe.classList.add('opacity-0');
                    iframe.classList.remove('opacity-100');
                }
            }
            
            this.setupIntersectionObserver();
        }

        setIsRunning(isRunning) {
            this.isRunning = isRunning;
            this.updatePlayPauseButton();
            this.setupIntersectionObserver();
        }

        updatePlayPauseButton() {
            const button = this.element.querySelector('.play-pause-btn');
            if (!button) return;

            const icon = button.querySelector('.icon');
            const text = button.querySelector('.button-text');
            
            if (this.isRunning) {
                if (icon) icon.innerHTML = createIcon('pause');
                if (text) text.textContent = 'Pause';
            } else {
                if (icon) icon.innerHTML = createIcon('play');
                if (text) text.textContent = 'Play';
            }
        }

        updateButtonLabels() {
            const resetText = this.element.querySelector('.reset-text');
            const playPauseText = this.element.querySelector('.play-pause-text');
            const editorLink = this.element.querySelector('.editor-link');
            
            if (resetText) {
                resetText.style.display = this.canvasWidth > 320 ? 'inline' : 'none';
            }
            
            if (playPauseText) {
                playPauseText.style.display = this.canvasWidth > 320 ? 'inline' : 'none';
            }
            
            if (editorLink) {
                if (this.canvasWidth > 360) {
                    editorLink.textContent = 'Abrir no Editor Web';
                } else if (this.canvasWidth > 180) {
                    editorLink.textContent = 'Editor Web';
                } else {
                    editorLink.textContent = 'Editor';
                }
            }
        }

        setupIntersectionObserver() {
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }

            if (!this.ref || !this.loaded || !this.isRunning) return;

            const intersectionCallback = (entries) => {
                if (entries.length % 2 === 0) return;

                const entry = entries[entries.length - 1];
                entry.isIntersecting ? this.resume() : this.pause();
            };

            this.intersectionObserver = new IntersectionObserver(intersectionCallback, {
                root: null,
                rootMargin: '0px',
                threshold: 0,
            });

            this.intersectionObserver.observe(this.ref);
        }

        setupEventListeners() {
            window.addEventListener('resize', this.handleWindowResize);
            
            // Setup iframe src when element is ready
            setTimeout(() => {
                if (this.ref && this.data['data-example-path']) {
                    this.setLoaded(false);
                    this.ref.src = this.data['data-example-path'];
                }
            }, 100);
        }

        createElement() {
            const container = document.createElement('div');
            container.className = 'example-component';
            // Max-width will be set when canvas dimensions are detected
            container.style.width = `${this.data['data-width'] ? (parseFloat(this.data['data-width'])+2) + 'px' : '100%'}`;

            console.log(this.data);

            container.innerHTML = `
                <div class="example-iframe-container">
                    <div class="loading-text">
                        Carregando sketch...
                    </div>
                    <iframe
                        class="opacity-0"
                        style="width: ${this.data['data-width'] ? this.data['data-width'] + 'px' : '100%'}; height: ${this.data['data-height'] || 300}px;"
                        loading="lazy"
                        title="${this.data['data-example-title'] || 'P5.js Sketch'}"
                        sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                </div>

                <div class="controls">
                    <div class="controls-left">
                        <button class="control-btn reset-btn" title="Reiniciar sketch">
                            <span class="icon">${createIcon('refresh')}</span>
                            <span class="reset-text button-text">Reset</span>
                        </button>
                    </div>

                    <a
                        href="${this.data['data-p5-editor'] || '#'}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="editor-link-container"
                        title="Abrir no Editor Web do P5.js"
                    >
                        <span class="editor-link">Abrir no Editor Web</span>
                        <span class="icon">${createIcon('external')}</span>
                    </a>
                </div>
            `;

            // Configurar referências e event listeners
            this.ref = container.querySelector('iframe');
            if (this.ref) {
                this.ref.addEventListener('load', this.handleLoad);
            }
            
            const resetBtn = container.querySelector('.reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', this.reset);
            }
            
            const playPauseBtn = container.querySelector('.play-pause-btn');
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', this.toggleRunning);
            }

            return container;
        }

        destroy() {
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }
            window.removeEventListener('resize', this.handleWindowResize);
            
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }

        getElement() {
            return this.element;
        }
    }

    // Função para criar uma instância do componente
    function createExample(data) {
        return new Example(data);
    }

    // Função para inicializar todos os players na página
    function initializeExamplePlayers() {
        const playerElements = document.querySelectorAll('.example-player:not(.initialized)');
        
        playerElements.forEach(element => {
            // Extrair dados dos atributos data-* do elemento
            const data = {
                'data-example-path': element.getAttribute('data-example-path'),
                'data-height': element.getAttribute('data-height'),
                'data-width': element.getAttribute('data-width'),
                'data-example-title': element.getAttribute('data-example-title') || 'P5.js Sketch',
                'data-p5-editor': element.getAttribute('data-p5-editor') || '#',
                pauseAtBeginning: element.getAttribute('data-pause-at-beginning') === 'true'
            };
            
            // Validar se os dados necessários estão presentes
            if (!data['data-example-path']) {
                console.warn('Example player missing required data-example-path attribute:', element);
                element.innerHTML = '<p style="color: red; text-align: center;">❌ Erro: atributo data-example-path é obrigatório</p>';
                return;
            }
            
            try {
                // Criar a instância do player
                const example = createExample(data);
                
                // Marcar como inicializado
                element.classList.add('initialized');
                
                // Substituir o elemento original pelo componente
                element.parentNode.replaceChild(example.getElement(), element);
                
                // Armazenar referência para possível cleanup posterior
                example.getElement().exampleInstance = example;
                
                console.log('P5.js player initialized for:', data['data-example-path']);
            } catch (error) {
                console.error('Error initializing P5.js player:', error);
                element.innerHTML = '<p style="color: red; text-align: center;">❌ Erro ao inicializar player</p>';
            }
        });
    }

    // Função para cleanup
    function destroyAllExamplePlayers() {
        const playerElements = document.querySelectorAll('.example-component');
        playerElements.forEach(element => {
            if (element.exampleInstance) {
                element.exampleInstance.destroy();
            }
        });
    }

    // Inicialização para MkDocs Material
    function initMkDocsIntegration() {
        // Inicializar players existentes
        initializeExamplePlayers();

        // Observar mudanças no DOM para navegação SPA do Material
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(function(mutations) {
                let shouldReinitialize = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.classList && node.classList.contains('example-player')) {
                                    shouldReinitialize = true;
                                } else if (node.querySelector && node.querySelector('.example-player')) {
                                    shouldReinitialize = true;
                                }
                            }
                        });
                    }
                });

                if (shouldReinitialize) {
                    setTimeout(initializeExamplePlayers, 100);
                }
            });

            // Observar mudanças no conteúdo principal
            const content = document.querySelector('.md-content');
            if (content) {
                observer.observe(content, {
                    childList: true,
                    subtree: true
                });
            }
        }

        // Escutar eventos de navegação do Material Theme
        document.addEventListener('DOMContentLoaded', initializeExamplePlayers);
        
        // Para compatibilidade com instant loading
        if (typeof window !== 'undefined') {
            window.addEventListener('load', initializeExamplePlayers);
        }
    }

    // Inicializar quando possível
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMkDocsIntegration);
    } else {
        initMkDocsIntegration();
    }

    // Expor funções globais se necessário
    if (typeof window !== 'undefined') {
        window.P5ExamplePlayer = {
            init: initializeExamplePlayers,
            destroy: destroyAllExamplePlayers,
            create: createExample
        };
    }

})();