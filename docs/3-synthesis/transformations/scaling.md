# Escala

A escala é uma transformação que altera o tamanho de um objeto &mdash; ao alterar o tamanho do sistema de coordenadas &mdash; em relação a um ponto fixo, conhecido como **centro de escala**. Em termos de vetores, a escala de um ponto \( P(x, y) \) por fatores \( s_x \) e \( s_y \) resulta em um novo ponto \( P'(x', y') \), onde:

\[
\begin{align*}
x' &= x \cdot s_x \\
y' &= y \cdot s_y
\end{align*}
\]

ou

$$
\begin{align}
P' = S(s_x, s_y) \cdot P
\end{align}
$$  

onde \( S(s_x, s_y) \) é a matriz de escala:

\[
S(s_x, s_y) = \begin{bmatrix}
s_x & 0 \\
0 & s_y
\end{bmatrix}   
\]

A matriz de escala também pode ser representada utilizando a matriz homogênea 3x3:

\[
S(s_x, s_y) = \begin{bmatrix}
s_x & 0 & 0 \\
0 & s_y & 0 \\
0 & 0 & 1
\end{bmatrix}
\]

O sketch a seguir ilustra a aplicação da escala em p5.js, usando a função `scale(sx, sy)` entre `push()` e `pop()`.

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  push();
  translate(width / 2, height / 2);
  scale(1.5, 0.5);
  rectMode(CENTER);
  rect(0, 0, 100, 100);
  pop();
}
```

Neste exemplo, o retângulo é desenhado no centro do canvas e escalado em \( 1.5 \) vezes na direção x e \( 0.5 \) vezes na direção y. A função `push()` salva o estado atual do sistema de coordenadas, e a função `pop()` restaura o estado salvo, garantindo que a escala não afete outras partes do desenho.

<div class="sketch-runner"
     data-sketch-path="../demo-scale.js"
     data-width="400"
     data-height="400"
     data-title="Grupo de casas com escala"
     data-pause-at-beginning="false">
</div>