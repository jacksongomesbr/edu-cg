# Sketch Runner - Componente para Execução Direta de Sketches P5.js

O componente `sketch-runner` permite incorporar sketches P5.js diretamente a partir de arquivos JavaScript, criando o HTML necessário em tempo de execução e executando o código dentro da própria página.

## Diferenças do Example Player

| Feature | Example Player | Sketch Runner |
|---------|---------------|---------------|
| **Execução** | Iframe com HTML completo | Execução direta no DOM |
| **Carregamento** | P5.js carregado no iframe | P5.js compartilhado na página |
| **Performance** | Isolado, maior overhead | Melhor performance |
| **Interação** | Limitada pelo iframe | Acesso completo ao DOM |
| **Debugging** | Difícil acesso ao contexto | DevTools da página principal |

## Como Usar

### HTML Básico

```html
<div class="sketch-runner" 
     data-sketch-path="/caminho/para/sketch.js"
     data-title="Meu Sketch">
</div>
```

### Atributos Disponíveis

| Atributo | Obrigatório | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `data-sketch-path` | ✅ | Caminho para o arquivo .js do sketch | `"./demo.js"` |
| `data-width` | ❌ | Largura fixa do container | `"400"` |
| `data-height` | ❌ | Altura fixa do container | `"300"` |
| `data-title` | ❌ | Título do sketch | `"Demo de Vetores"` |
| `data-editor-url` | ❌ | URL do P5.js Editor | `"https://editor.p5js.org/..."` |
| `data-pause-at-beginning` | ❌ | Iniciar pausado | `"true"` |

### Exemplo Completo

```html
<div class="sketch-runner" 
     data-sketch-path="../vectors/simple-vector-demo.js"
     data-width="400"
     data-height="300"
     data-title="Demonstração de Vetores"
     data-editor-url="https://editor.p5js.org/sketch/xyz"
     data-pause-at-beginning="false">
</div>
```

## Estrutura do Sketch JavaScript

O sketch deve seguir o padrão p5.js com modo de instância:

```javascript
// O código é executado como uma função que recebe 'p' como parâmetro
// Mas você pode usar as funções globais diretamente

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(220);
  ellipse(mouseX, mouseY, 50, 50);
}

// Outras funções p5.js funcionam normalmente
function mousePressed() {
  console.log('Mouse clicado!');
}
```

## Funcionalidades

### Controles Automáticos

- **Reset**: Reinicia o sketch completamente
- **Play/Pause**: Controla a execução (usando frameRate)
- **Link para Editor**: Abre o sketch no P5.js Editor (se fornecido)

### Otimizações Automáticas

- **Intersection Observer**: Pausa sketches fora da viewport
- **Responsive**: Ajusta tamanho baseado no container
- **Lazy Loading**: Carrega P5.js apenas quando necessário
- **Aspect Ratio**: Mantém proporção original do canvas

### Carregamento de P5.js

O componente carrega automaticamente o P5.js via CDN se não estiver presente:
- URL: `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js`
- Reutiliza instâncias já carregadas
- Compatível com múltiplos sketches na mesma página

## Exemplo de Uso na Documentação

Para usar em arquivos Markdown do MkDocs:

```markdown
## Demonstração de Vetores

Este exemplo mostra a soma de dois vetores:

<div class="sketch-runner" 
     data-sketch-path="../vectors/simple-vector-demo.js"
     data-title="Soma de Vetores Interativa">
</div>

Move o mouse para alterar o vetor B e ver como afeta a soma A+B.
```

## API JavaScript

Se necessário acessar programaticamente:

```javascript
// Inicializar manualmente
window.SketchRunner.init();

// Criar instância específica
const runner = window.SketchRunner.create({
  sketchPath: './demo.js',
  width: '400',
  pauseAtBeginning: false
});

// Cleanup
window.SketchRunner.destroy();
```

## Vantagens

1. **Performance**: Execução direta sem overhead de iframe
2. **Debugging**: Acesso completo via DevTools
3. **Flexibilidade**: Pode interagir com DOM da página
4. **Simplicidade**: Apenas arquivo JS necessário
5. **Reutilização**: P5.js compartilhado entre múltiplos sketches

## Limitações

1. **Isolamento**: Sketches compartilham contexto global
2. **Conflitos**: Variáveis globais podem conflitar
3. **Segurança**: Menos isolado que iframe
4. **Compatibilidade**: Requer P5.js modo global