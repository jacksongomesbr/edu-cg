# Matriz de transformação

As transformações 2D podem ser representadas por matrizes, o que permite combinar múltiplas transformações através de multiplicações delas. A ordem das transformações é fundamental, pois elas são aplicadas sequencialmente, e diferentes ordens podem resultar em efeitos visuais distintos.

Cada vez que uma das funções `translate()`, `rotate()` ou `scale()` é chamada em p5.js, a matriz de transformação atual é atualizada multiplicando-a pela matriz correspondente à transformação aplicada. A matriz de transformação inicial é a matriz identidade, que não altera as coordenadas dos pontos.

Matriz identidade é definida por: 

\[
I = \begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
\]

No contexto das transformações 2D, a multiplicação de matrizes permite combinar várias transformações em uma única matriz de transformação composta. Por exemplo, se aplicarmos uma translação seguida de uma rotação, a matriz de transformação resultante será o produto da matriz de rotação pela matriz de translação:

\[
M = R(\theta) \cdot T(t_x, t_y)
\]

onde \( M \) é a matriz de transformação composta, \( R(\theta) \) é a matriz de rotação e \( T(t_x, t_y) \) é a matriz de translação. 

Com matrizes homogêneas, todas as transformações podem ser representadas como matrizes 3x3, permitindo a combinação de translações, rotações e escalas em uma única operação de multiplicação de matrizes.

As matrizes homogêneas para as transformações básicas são:

- **Translação**:

\[
T(t_x, t_y) = \begin{bmatrix}
1 & 0 & t_x \\
0 & 1 & t_y \\
0 & 0 & 1
\end{bmatrix}
\]

- **Rotação**:

\[
R(\theta) = \begin{bmatrix}
\cos(\theta) & -\sin(\theta) & 0 \\
\sin(\theta) & \cos(\theta) & 0 \\
0 & 0 & 1
\end{bmatrix}
\]

- **Escala**:

\[
S(s_x, s_y) = \begin{bmatrix}
s_x & 0 & 0 \\
0 & s_y & 0 \\
0 & 0 & 1
\end{bmatrix}
\]

Exemplos numéricos de multiplicação de matrizes para combinações comuns de transformações:

- **Translação seguida de rotação:**

\[
M = R(\theta) \cdot T(t_x, t_y) = \begin{bmatrix}
\cos(\theta) & -\sin(\theta) & t_x \\
\sin(\theta) & \cos(\theta) & t_y \\
0 & 0 & 1
\end{bmatrix}
\]

- **Rotação seguida de translação:**

\[
M = T(t_x, t_y) \cdot R(\theta) = \begin{bmatrix}
\cos(\theta) & -\sin(\theta) & t_x \\
\sin(\theta) & \cos(\theta) & t_y \\
0 & 0 & 1
\end{bmatrix}
\]

- **Escala seguida de rotação**:

\[
M = R(\theta) \cdot S(s_x, s_y) = \begin{bmatrix}
s_x \cdot \cos(\theta) & -s_y \cdot \sin(\theta) & 0 \\
s_x \cdot \sin(\theta) & s_y \cdot \cos(\theta) & 0 \\
0 & 0 & 1
\end{bmatrix}
\]

A multiplicação de matrizes não é comutativa, ou seja, \( A \cdot B \neq B \cdot A \). Portanto, aplicar uma translação seguida de uma rotação geralmente produz um resultado diferente de aplicar uma rotação seguida de uma translação.

Como são matrizes pequenas, mesmo que você precise implementar a multiplicação de matrizes manualmente, o processo é simples. Abaixo está um exemplo de código em JavaScript que multiplica duas matrizes sem utilizar laços de repetição (como convencionalmente é implementada a multiplicação de matrizes):

```javascript
function multiplyMatrices(A, B) {
    const m00 = A[0][0] * B[0][0] + A[0][1] * B[1][0] + A[0][2] * B[2][0];
    const m01 = A[0][0] * B[0][1] + A[0][1] * B[1][1] + A[0][2] * B[2][1];
    const m02 = A[0][0] * B[0][2] + A[0][1] * B[1][2] + A[0][2] * B[2][2];
    const m10 = A[1][0] * B[0][0] + A[1][1] * B[1][0] + A[1][2] * B[2][0];
    const m11 = A[1][0] * B[0][1] + A[1][1] * B[1][1] + A[1][2] * B[2][1];
    const m12 = A[1][0] * B[0][2] + A[1][1] * B[1][2] + A[1][2] * B[2][2];
    const m20 = A[2][0] * B[0][0] + A[2][1] * B[1][0] + A[2][2] * B[2][0];
    const m21 = A[2][0] * B[0][1] + A[2][1] * B[1][1] + A[2][2] * B[2][1];
    const m22 = A[2][0] * B[0][2] + A[2][1] * B[1][2] + A[2][2] * B[2][2];

    return [
        [ m00, m01, m02 ],
        [ m10, m11, m12 ],
        [ m20, m21, m22 ]
    ];
}
```

A seguir, um trecho de código que demonstra como utilizar a função `multiplyMatrices` para combinar uma translação e uma rotação:

```javascript
// Definindo uma translação de (100, 50)
const translationMatrix = [
    [1, 0, 100],
    [0, 1, 50],
    [0, 0, 1]
];

// Definindo uma rotação de 45 graus (π/4 radianos)
const angle = Math.PI / 4;
const rotationMatrix = [
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 1]
];

// Multiplicando a matriz de rotação pela matriz de translação
const combinedMatrix = multiplyMatrices(rotationMatrix, translationMatrix);
console.log(combinedMatrix);
```

Felizmente, com a p5.js você não precisa se preocupar com a implementação da multiplicação de matrizes, pois a biblioteca já faz isso para você. Basta chamar as funções `translate()`, `rotate()` e `scale()` na ordem desejada, e a p5.js cuidará da multiplicação das matrizes de transformação internamente.

Na p5.js as funções `push()` e `pop()` são usadas para salvar e restaurar o estado da matriz de transformação. Isso é útil quando queremos aplicar transformações temporárias a um objeto sem afetar outros objetos desenhados posteriormente.

