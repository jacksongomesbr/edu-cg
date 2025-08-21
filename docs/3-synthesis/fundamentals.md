# Fundamentos do Processing

!!! note

    O conteúdo deste curso, em termos de Processing, utiliza a p5.js (Processing para JavaScript)


## Ambiente de desenvolvimento

O p5.js pode ser utilizado diretamente no browser, por meio do [p5.js Web Editor](https://editor.p5js.org/) ou localmente, por exemplo, utilizando o [Visual Studio Code (VS Code)](https://code.visualstudio.com/).

No caso do Web Editor, sugiro que você crie uma conta de usuário para poder salvar seus sketches e, assim, ter acesso a eles em qualquer momento e de qualquer lugar. A utilizar o VS Code, recomendo utilizar em conjunto com um sistema de versionamento de código-fonte como o Github.


## Estrutura do sketch

O sketch é um arquivo de texto com código-fonte escrito em JavaScript. Assim, a p5.js é uma biblioteca para JavaScript que permite a criação de programas coloridos, com recursos de animação e interação com os usuários. 

Ao utilizar o Web Editor, ele começa com o seguinte código inicial do sketch:

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
```

O código (uma espécie de *hello world*) está dividido em dois blocos que se comportam de maneiras diferentes:

- bloco [`setup()`](https://p5js.org/reference/p5/setup/) executa apenas uma vez, assim que o sketch inicia sua execução
- bloco [`draw()`](https://p5js.org/reference/p5/draw/) executa repetidamente enquanto o sketch está em execução, por padrão, 60 vezes por segundo (60fps)

Além disso, o sketch utiliza duas funções básicas:

- [`createCanvas()`](https://p5js.org/reference/p5/createCanvas/) cria um elemento `canvas` (do HTML) de acordo com os parâmetros informados. No sketch, chamar `createCanvas(400, 400)` significa criar um canvas com $400 \times 400$ pixels
- [`background()`](https://p5js.org/reference/p5/background/) define a cor de fundo do background do canvas. No sketch, chamar `background(220)` significa pintar o canvas em um tom de cinza claro


## Desenhando formas

O desenho de formas pode ser feito por meio de funções que desenham "primitivas" geométricas, como `circle()` para desenhar círculos e `rect()`, para retângulos. O sketch a seguir utiliza funções para desenhar algumas primitivas.

<div class="example-player"
     data-example-title="Walker random"
     data-example-path="/examples/synthesis/8-fundamentals-shapes"
     data-p5-editor="https://editor.p5js.org/jacksongomes/sketches/JHj7jhJsp">
</div>

Parte do sketch contém o seguinte.

```javascript
var halfHeight;

function setup() { ... }

function draw() {
  background(255);
  point(10, halfHeight);
  line(50, halfHeight, 150, halfHeight);
  circle(200, halfHeight, 50);
  rect(250, halfHeight - 25, 50, 50);
  triangle(325, halfHeight + 25, 350, halfHeight - 25, 375, halfHeight + 25);
}
```

O sketch utiliza a variável `halfHeight` para armazenar o valor da metade da altura do canvas (que é obtido a partir da constante [`height`](https://p5js.org/reference/p5/height/)). 

A função [`point()`](https://p5js.org/reference/p5/point/) desenha um ponto (por padrão, de dimensão $1 \times 1$ pixels) na coordenada `(x, y)`. Neste caso, o ponto é desenhado na coordenada `(10, halfHeight)`.

A função [`line()`](https://p5js.org/reference/p5/line/) desenha uma linha reta da coordenada `(x1, y1)` até a coordeanda `(x2, y2)`. 

A função [`circle()`](https://p5js.org/reference/p5/circle/) desenha um círculo a partir do centro na coordenada `(x, y)` com diâmetro `d`. Neste caso, o centro do círculo está exatamente no meio do canvas.

A função [`rect()`](https://p5js.org/reference/p5/rect/) desenha um retângulo com o canto superior direito na coordenada `(x, y)` com largura `w` e altura `h`. Perceba a matemática necessária para posicionar adequadamente o retângulo, já que seu desenho não parte do centro, como no caso do círculo, mas no canto superior esquerdo.

Por fim, a função [`triangle()`](https://p5js.org/reference/p5/triangle/) desenha um triângulo com base em três coordenadas:

- a coordenada posicionada na base mais à esquerda é o início, a coordenada `(x1, y1)`
- na sequência, a coordenada do topo `(x2, y2)`
- por fim, na base e mais à direita, a coordenada `(x3, y3)`

A figura a seguir ajuda a ilustrar essas informações, indicando as coordenadas e os valores utilizados para o desenho de cada forma primitiva.

![](/3-synthesis/image1.png)

Na sequência das habilidades iniciais de lidar com a p5.js, temos a evolução para utilizar recursos de animação, o que mostra a próxima seção.


## Animação básica

A função `draw()` está presente na estrutura do sketch para permitir executar código dentro de um "loop", que geralmente executa cerca de 60 vezes por segundo. Daí uma associação à quantidade de "quadro por segundo" (frames per second, ou FPS).

Código que realiza animação, geralmente, altera valores de variáveis ou parâmetros dentro da função `draw()`. Por isso, o sketch a seguir ilustra como funciona o movimento de um círculo para baixo, no eixo y.

<div class="example-player"
     data-example-title="Animation basics"
     data-example-path="/examples/synthesis/9-fundamentals-animation"
     data-p5-editor="https://editor.p5js.org/jacksongomes/sketches/nk-DE6mB_">
</div>

Desconsidere que o sketch tem várias informações visuais extras na tela, o importante é o controle da movimentação do círculo. Assim, a parte importante que queremos considerar está aqui.

```javascript
var cx, cy;     // As coordenadas do centro do círculo
var d = 50;     // O diâmetro do círculo
var r = d / 2;  // O raio do círculo (metade do diâmetro)

function setup() {
  createCanvas(400, 400);
  cx = width / 2;
  cy = height / 2;
}

function draw() {
  // 1: desenha
  background(220);
  circle(cx, cy, d);

  // 2: determina a próxima posição
  if (cy + r < height - 1) {
    cy++;
  } 
}
```

As coordenadas do centro do círculo, variáveis `cx` e `cy`, são iniciadas na função `setup()` para estarem no centro do canvas. O código da função `draw()` é responsável por desenhar o círculo na posição atual e também atualizar próxima posição do círculo, incrementando o valor da variável `cy` em uma unidade. O resultado disso é que o círculo "parece" se movimentar para baixo. 

De fato, isso determina um **framework** para o código que realiza animação:

1. desenhar; e
2. calcular e atualizar posições e outros parâmetros para o próximo frame;
3. repetir.

Este framework vai ser atualizado para incluir outros elementos posteriormente, mas, por enquanto, ele é fundamental para entendermos a lógica da animação baseada em atualização de quadros por segundo.


## Detecção de colisão

A detecção de colisão é uma parte importante da animação e da criação de experiências interativas em computação gráfica. É esse o conceito que permite executar um código diferente quando um objeto, por exemplo, um círculo, encontra uma área que é tomada por outro objeto, por exemplo, uma parede.

A detecção de colisão é seguida por um tratamento, ou seja, o que deve ser feito **quando** ocorrer uma colisão.

Voltando ao exemplo da animação do círculo que vai para baixo, em direção à parte inferior do canvas, pdoeríamos dizer que nosso interesse seria parar a animação quando o centro do círculo atingisse determinado valor na coordenada y. 

A lógica, neste caso, precisa de um ajuste porque a coordenada do centro do círculo não pode ser a mesma da altura do canvas porque isso faria com que metade do círculo fosse desenhada para fora do canvas. Assim, precisamos considerar que a soma entre a coordenada y do centro do círculo e o raio é que deve ser menor do que a altura para que o círculo continue se movendo.

Essa lógica é representada no condicional dentro da função `draw()`.

```javascript
function draw() {
  // 1: desenha
  background(220);
  circle(cx, cy, d);

  // 2: determina a próxima posição
  if (cy + r < height - 1) {
    cy++;
  } 
```

Há ainda mais um ajuste: considerar a altura menos 1, que é a unidade da linha de borda para desenho do círculo.

!!! note

    O formato padrão de desenho do círculo não é apenas o círculo, mas considera, além das propriedades já indicadas, uma borda de um pixel de unidade e o preenchimento.

Essa lógica complementa o **framework de animação**:

1. desenhar;
2. calcular a próxima posição;
3. detectar colisão;
    1. se não tiver colisão, atualizar a posição;
    2. se tiver colisão, não atualizar a posição;
4. repetir.

Com isso, temos animação, detecção e tratamento de colisão para que o movimento do círculo dentro do canvas represente uma simulação mais confiável segundo alguns critérios de conhecimento do mundo real a respeito de como seria observar o fenômeno de uma esfera se movendo dentro de uma caixa.

Para finalizar esta introdução, o próximo sketch introduz dois conceitos importantes: velocidade e direção.


## Velocidade e direção

O framework de animação de movimento apresentado até aqui altera a posição do círculo em uma unidade. O que aconteceria se o incremento fosse em 5 ou 10 unidades? A resposta mais óbvia é que o círculo precisaria de menos quadros (passos de animação) para chegar até a borda do canvas.

Este é um conceito intuitivo de **velocidade**: a magnitude do incremento na posição faz com que o círculo precise de menos ou mais quadros para alcançar a borda da caixa, ou seja, mais ou menos tempo, já que temos o conceito de quadros por segundo (FPS).

Outro conceito importante é o de **direção**. Um incremento no eixo Y faz o círculo se mover para baixo. Um decremento, ou um incremento de um valor negativo, faz o círculo se mover para cima. Assim, podemos afirmar que o sinal do incremento determina a direção:

- sinal positivo: para baixo;
- sinal negativo: para cima.

O sketch a seguir ilustra estes conceitos.

<div class="example-player"
     data-example-title="Animation basics"
     data-example-path="/examples/synthesis/10-fundamentals-animation-direction"
     data-p5-editor="https://editor.p5js.org/jacksongomes/sketches/cSPml5I7m">
</div>

A parte que nos interessa do sketch está aqui.

```javascript
var cx, cy;
var d = 50;
var r = d / 2;
var direction = +1;
var speed = 5;

function draw() {
  background(220);
  
  // desenha círculo
  circle(cx, cy, d);
  
  // calcula a próxima posição
  var nextcy = cy + speed * direction;

  // detecta e trata colisão
  if (nextcy + r > height || nextcy - r < 0) {
    direction = -direction;
  } else {
    cy = nextcy;
  }
}
```

A variável `speed` determina a velocidade do movimento do círculo e é iniciada com o valor `5`. A variável `direction` determina a direção do movimento (para cima ou para baixo) e é iniciada com o valor `+1` (o círculo inicia movendo-se para baixo).

Outra diferença para o sketch anterior está na forma como calculamos a próxima posição. Agora precisamos levar em consideração não apenas o valor da coordenada y do centro do círculo, mas também a velocidade e a direção. A equação a seguir representa o que precisamos neste momento.

$$
y_{next} = y + speed \times direction
$$

Assim, o próximo valor de y é resultado da soma entre o valor atual de y e a multiplicação entre velocidade e direção. Se essa parcela da soma que envolve a velocidade e a direção for positiva, o próximo valor de y também será e, assim, o círculo se moverá para baixo. Caso contrário, se a parcela for negativa, o círculo se moverá para cima.

Por fim, a detecção e o tratamento de colisão passa por uma alteração para que o círculo, ao colidir com a parte inferior do canvas, mova-se para cima e, ao colidir com a parte superior do canvas, mova-se para baixo. A inversão a direção é justamente o que ocorre se houver uma colisão, determinada pelo condicional a seguir.

```javascript
if (nextcy + r > height || nextcy - r < 0) {
  direction = -direction;
}
```

Assim, o framework de animação de movimento passa por uma última atualização nesta seção do livro:

1. desenhar;
2. calcular a próxima posição com base na velocidade e direção;
3. detectar colisão;
    1. se não tiver colisão, atualizar a posição;
    2. se tiver colisão, alternar a direção;
4. repetir.

Essa é a lógica para o funcionamento de uma animação de movimento de um círculo se movendo para cima e para baixo dentro do canvas.



