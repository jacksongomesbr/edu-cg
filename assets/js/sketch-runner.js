/* docs/assets/js/sketch-runner.js */

(function() {
    'use strict';

    // Constante para altura máxima do canvas
    const CANVAS_MAX_HEIGHT = 400;
    const P5_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.8/p5.min.js';

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

    // Função para criar ícones SVG modernos
    function createIcon(type) {
        const icons = {
            play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                     <path d="M8 5v14l11-7z"/>
                   </svg>`,
            pause: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
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
                       </svg>`,
            fullscreen: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                           <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                           <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                           <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                           <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
                         </svg>`,
            minimize: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                         <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                         <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
                         <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                       </svg>`
        };
        return icons[type] || '';
    }

    // Classe principal do componente SketchRunner
    class SketchRunner {
        constructor(data) {
            this.data = data;
            this.container = null;
            this.canvasContainer = null;
            this.p5Instance = null;
            this.sketchCode = null;
            this.loaded = false;
            this.isRunning = !data.pauseAtBeginning;
            this.aspectRatio = null;
            this.canvasWidth = 400;
            this.pausedFrameRate = 0;
            this.intersectionObserver = null;
            this.isP5Loaded = false;
            
            // Bind dos métodos
            this.reset = this.reset.bind(this);
            this.toggleRunning = this.toggleRunning.bind(this);
            this.pause = this.pause.bind(this);
            this.resume = this.resume.bind(this);
            this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 500);
            
            this.element = this.createElement();
            this.init();
        }

        async init() {
            try {
                await this.ensureP5Loaded();
                await this.loadSketch();
                this.runSketch();
            } catch (error) {
                console.error('Error initializing sketch runner:', error);
                this.showError('Erro ao carregar o sketch');
            }
        }

        async ensureP5Loaded() {
            // Verificar se p5.js já está disponível
            if (typeof window.p5 !== 'undefined') {
                this.isP5Loaded = true;
                return Promise.resolve();
            }

            // Não carregar p5.js se ainda não estiver disponível - esperar que esteja na página
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 50; // 5 segundos máximo
                
                const checkP5 = () => {
                    if (typeof window.p5 !== 'undefined') {
                        this.isP5Loaded = true;
                        resolve();
                    } else if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(checkP5, 100);
                    } else {
                        reject(new Error('P5.js not available'));
                    }
                };
                checkP5();
            });
        }

        async loadSketch() {
            if (!this.data.sketchPath) {
                throw new Error('Caminho do sketch não fornecido');
            }

            const response = await fetch(this.data.sketchPath);
            if (!response.ok) {
                throw new Error(`Erro ao carregar sketch: ${response.status}`);
            } 
                        
            this.sketchCode = await response.text();
        }

        runSketch() {
            try {
                // Limpar instância anterior se existir
                if (this.p5Instance) {
                    try {
                        this.p5Instance.remove();
                    } catch (e) {
                        console.warn('Error removing previous instance:', e);
                    }
                }

                // Reset canvas detection attempts
                this.canvasDetectionAttempts = 0;

                // Executar o código do sketch no contexto global
                eval(this.sketchCode);
                
                // Usar o modo global do p5.js especificando apenas o container
                this.p5Instance = new window.p5(this.canvasContainer);
                
                // Aguardar criação do canvas
                setTimeout(() => {
                    this.detectCanvas();
                }, 200);

            } catch (error) {
                console.error('Error running sketch:', error);
                this.showError('Erro ao executar o sketch: ' + error.message);
            }
        }

        detectCanvas() {
            const canvas = this.canvasContainer.querySelector('canvas');
            
            if (canvas) {
                this.adjustCanvas(canvas);
                this.setLoaded(true);
                
                // Aplicar pausa inicial se necessário
                if (this.data.pauseAtBeginning) {
                    setTimeout(() => this.pause(), 200);
                }
            } else {
                // Tentar novamente após um breve delay, máximo 10 tentativas
                if (!this.canvasDetectionAttempts) this.canvasDetectionAttempts = 0;
                this.canvasDetectionAttempts++;
                
                if (this.canvasDetectionAttempts < 10) {
                    setTimeout(() => this.detectCanvas(), 200);
                } else {
                    this.showError('Canvas não foi criado');
                }
            }
        }

        adjustCanvas(canvas) {
            this.aspectRatio = canvas.width / canvas.height;
            this.canvasWidth = canvas.width;
            
            // Calcular tamanho ideal respeitando as dimensões originais
            const containerMaxWidth = Math.min(canvas.width, CANVAS_MAX_HEIGHT * this.aspectRatio);
            const containerHeight = containerMaxWidth / this.aspectRatio;
            
            // Ajustar estilo do container
            this.canvasContainer.style.width = `${containerMaxWidth}px`;
            this.canvasContainer.style.height = `${containerHeight}px`;
            this.canvasContainer.style.maxWidth = 'none';
            this.canvasContainer.style.display = 'block';
            this.canvasContainer.style.margin = '0 auto'; // Centralizar
            
            // Aplicar estilos ao canvas mantendo proporções corretas
            canvas.style.width = `${containerMaxWidth}px`;
            canvas.style.height = `${containerHeight}px`;
            canvas.style.display = 'block';
            canvas.style.maxWidth = 'none';
            canvas.style.maxHeight = 'none';
            
            // Canvas ajustado com sucesso
        }

        reset() {
            this.setLoaded(false);
            this.setIsRunning(true);
            this.runSketch();
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
            if (!this.p5Instance) return;
            
            try {
                // Salvar frameRate atual
                if (typeof this.p5Instance.getFrameRate === 'function') {
                    const currentFrameRate = this.p5Instance.getFrameRate();
                    if (currentFrameRate && currentFrameRate > 0) {
                        this.pausedFrameRate = currentFrameRate;
                    }
                }
                
                // Pausar
                if (typeof this.p5Instance.frameRate === 'function') {
                    this.p5Instance.frameRate(0);
                }
            } catch (error) {
                console.warn('Error pausing sketch:', error);
            }
        }

        resume() {
            if (!this.p5Instance) return;
            
            try {
                if (typeof this.p5Instance.frameRate === 'function') {
                    // Restaurar frameRate salvo ou usar 60fps como padrão
                    const resumeFrameRate = this.pausedFrameRate > 0 ? this.pausedFrameRate : 60;
                    this.p5Instance.frameRate(resumeFrameRate);
                }
            } catch (error) {
                console.warn('Error resuming sketch:', error);
            }
        }

        handleWindowResize() {
            if (this.canvasContainer) {
                this.canvasWidth = this.canvasContainer.offsetWidth;
                this.updateButtonLabels();
                
                // Atualizar max-width do container
                if (this.aspectRatio) {
                    this.canvasContainer.style.maxWidth = `${CANVAS_MAX_HEIGHT * this.aspectRatio}px`;
                }
            }
        }

        setLoaded(loaded) {
            this.loaded = loaded;
            const loadingDiv = this.element.querySelector('.loading-text');
            const canvasContainer = this.element.querySelector('.canvas-container');
            const statusIndicator = this.element.querySelector('.status-indicator');
            
            if (loaded) {
                // Esconder loading
                if (loadingDiv) loadingDiv.classList.add('hidden');
                
                // Mostrar canvas com animação
                if (canvasContainer) {
                    canvasContainer.classList.remove('opacity-0', 'loading');
                    canvasContainer.classList.add('opacity-100');
                }
                
                // Remover classe loading do componente
                this.element.classList.remove('loading');
                
                // Atualizar status indicator
                if (statusIndicator) {
                    statusIndicator.classList.remove('error');
                    statusIndicator.title = this.isRunning ? 'Executando' : 'Pausado';
                }
                
            } else {
                // Mostrar loading
                if (loadingDiv) loadingDiv.classList.remove('hidden');
                
                // Esconder canvas
                if (canvasContainer) {
                    canvasContainer.classList.add('opacity-0', 'loading');
                    canvasContainer.classList.remove('opacity-100');
                }
                
                // Adicionar classe loading ao componente
                this.element.classList.add('loading');
            }
            
            this.setupIntersectionObserver();
        }

        setIsRunning(isRunning) {
            this.isRunning = isRunning;
            this.updatePlayPauseButton();
            this.updateStatusIndicator();
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
                button.title = 'Pausar sketch';
                button.setAttribute('aria-label', 'Pausar sketch');
            } else {
                if (icon) icon.innerHTML = createIcon('play');
                if (text) text.textContent = 'Play';
                button.title = 'Reproduzir sketch';
                button.setAttribute('aria-label', 'Reproduzir sketch');
            }
        }

        updateStatusIndicator() {
            const statusIndicator = this.element.querySelector('.status-indicator');
            if (!statusIndicator) return;

            statusIndicator.classList.remove('paused', 'error');
            
            if (this.isRunning) {
                statusIndicator.title = 'Executando';
            } else {
                statusIndicator.classList.add('paused');
                statusIndicator.title = 'Pausado';
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

            if (!this.canvasContainer || !this.loaded || !this.isRunning) return;

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

            this.intersectionObserver.observe(this.canvasContainer);
        }

        showError(message) {
            const errorDiv = this.element.querySelector('.loading-text');
            const statusIndicator = this.element.querySelector('.status-indicator');
            
            if (errorDiv) {
                errorDiv.innerHTML = `<span>❌ ${message}</span>`;
                errorDiv.style.color = '#ef4444';
                errorDiv.classList.remove('hidden');
            }
            
            if (statusIndicator) {
                statusIndicator.classList.add('error');
                statusIndicator.title = 'Erro no sketch';
            }
            
            // Remover classe loading se houver erro
            this.element.classList.remove('loading');
            
            // Esconder canvas container
            const canvasContainer = this.element.querySelector('.canvas-container');
            if (canvasContainer) {
                canvasContainer.classList.add('opacity-0');
                canvasContainer.classList.remove('opacity-100', 'loading');
            }
        }

        createElement() {
            const container = document.createElement('div');
            container.className = 'sketch-runner-component loading';
            // Remover limitação de largura fixa para permitir auto-sizing

            container.innerHTML = `
                <div class="sketch-canvas-wrapper">
                    <div class="status-indicator ${this.isRunning ? '' : 'paused'}" title="${this.isRunning ? 'Executando' : 'Pausado'}"></div>
                    <div class="loading-text">
                        <span>Carregando sketch...</span>
                    </div>
                    <div class="canvas-container opacity-0 loading"></div>
                </div>

                <div class="controls">
                    <div class="controls-left">
                        <button class="control-btn reset-btn" title="Reiniciar sketch" aria-label="Reiniciar sketch">
                            <span class="icon">${createIcon('refresh')}</span>
                            <span class="reset-text button-text">Reset</span>
                        </button>
                        
                        <button class="control-btn play-pause-btn" title="${this.isRunning ? 'Pausar' : 'Reproduzir'} sketch" aria-label="${this.isRunning ? 'Pausar' : 'Reproduzir'} sketch">
                            <span class="icon">${createIcon(this.isRunning ? 'pause' : 'play')}</span>
                            <span class="play-pause-text button-text">${this.isRunning ? 'Pause' : 'Play'}</span>
                        </button>
                    </div>

                    ${this.data.editorUrl ? `
                    <a
                        href="${this.data.editorUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="editor-link-container"
                        title="Abrir no Editor Web do P5.js"
                        aria-label="Abrir sketch no Editor Web do P5.js"
                    >
                        <span class="editor-link">Abrir no Editor Web</span>
                        <span class="icon">${createIcon('external')}</span>
                    </a>
                    ` : ''}
                </div>
            `;

            // Configurar referências
            this.canvasContainer = container.querySelector('.canvas-container');
            
            // Event listeners
            const resetBtn = container.querySelector('.reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', this.reset);
            }
            
            const playPauseBtn = container.querySelector('.play-pause-btn');
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', this.toggleRunning);
            }

            // Window resize listener
            window.addEventListener('resize', this.handleWindowResize);

            return container;
        }

        destroy() {
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }
            
            if (this.p5Instance) {
                this.p5Instance.remove();
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
    function createSketchRunner(data) {
        return new SketchRunner(data);
    }

    // Função para inicializar todos os sketch runners na página
    function initializeSketchRunners() {
        const runnerElements = document.querySelectorAll('.sketch-runner:not(.initialized)');
        
        runnerElements.forEach(element => {
            // Extrair dados dos atributos data-* do elemento
            const data = {
                sketchPath: element.getAttribute('data-sketch-path'),
                width: element.getAttribute('data-width'),
                height: element.getAttribute('data-height'),
                title: element.getAttribute('data-title') || 'P5.js Sketch',
                editorUrl: element.getAttribute('data-editor-url'),
                pauseAtBeginning: element.getAttribute('data-pause-at-beginning') === 'true'
            };
            
            // Validar se os dados necessários estão presentes
            if (!data.sketchPath) {
                console.warn('Sketch runner missing required data-sketch-path attribute:', element);
                element.innerHTML = '<p style="color: red; text-align: center;">❌ Erro: atributo data-sketch-path é obrigatório</p>';
                return;
            }
            
            try {
                // Criar a instância do runner
                const runner = createSketchRunner(data);
                
                // Marcar como inicializado
                element.classList.add('initialized');
                
                // Substituir o elemento original pelo componente
                element.parentNode.replaceChild(runner.getElement(), element);
                
                // Armazenar referência para possível cleanup posterior
                runner.getElement().sketchRunnerInstance = runner;
                
                // Sketch runner inicializado
            } catch (error) {
                console.error('Error initializing sketch runner:', error);
                element.innerHTML = '<p style="color: red; text-align: center;">❌ Erro ao inicializar sketch runner</p>';
            }
        });
    }

    // Função para cleanup
    function destroyAllSketchRunners() {
        const runnerElements = document.querySelectorAll('.sketch-runner-component');
        runnerElements.forEach(element => {
            if (element.sketchRunnerInstance) {
                element.sketchRunnerInstance.destroy();
            }
        });
    }

    // Inicialização para MkDocs Material
    function initMkDocsIntegration() {
        // Inicializar runners existentes
        initializeSketchRunners();

        // Observar mudanças no DOM para navegação SPA do Material
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(function(mutations) {
                let shouldReinitialize = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.classList && node.classList.contains('sketch-runner')) {
                                    shouldReinitialize = true;
                                } else if (node.querySelector && node.querySelector('.sketch-runner')) {
                                    shouldReinitialize = true;
                                }
                            }
                        });
                    }
                });

                if (shouldReinitialize) {
                    setTimeout(initializeSketchRunners, 100);
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
        document.addEventListener('DOMContentLoaded', initializeSketchRunners);
        
        // Para compatibilidade com instant loading
        if (typeof window !== 'undefined') {
            window.addEventListener('load', initializeSketchRunners);
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
        window.SketchRunner = {
            init: initializeSketchRunners,
            destroy: destroyAllSketchRunners,
            create: createSketchRunner
        };
    }

})();