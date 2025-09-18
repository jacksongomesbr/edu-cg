# Determinantes

## Conceito

O determinante é um valor escalar associado a uma matriz quadrada que possui importantes propriedades geométricas e algébricas. Para uma matriz A, denotamos seu determinante como $\det(A)$ ou $\left| A \right|$.

## Determinante de Matrizes 2x2

Para uma matriz 2x2:

$$A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$$

O determinante é calculado como:

$$\det(A) = ad - bc$$

### Exemplo Numérico 2x2

$$A = \begin{pmatrix} 3 & 2 \\ 1 & 4 \end{pmatrix}$$

$$\det(A) = (3)(4) - (2)(1) = 12 - 2 = 10$$

## Determinante de Matrizes 3x3

Para uma matriz 3x3, utilizamos a regra de Sarrus ou expansão por cofatores:

$$A = \begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}$$

### Regra de Sarrus

$$\det(A) = aei + bfg + cdh - ceg - afh - bdi$$

### Exemplo Numérico 3x3

$$A = \begin{pmatrix} 2 & 1 & 3 \\ 0 & 4 & 1 \\ 1 & 2 & 2 \end{pmatrix}$$

Aplicando a regra de Sarrus:

- Produtos positivos: $(2)(4)(2) + (1)(1)(1) + (3)(0)(2) = 16 + 1 + 0 = 17$
- Produtos negativos: $(3)(4)(1) + (2)(1)(2) + (1)(0)(2) = 12 + 4 + 0 = 16$

$$\det(A) = 17 - 16 = 1$$

## Propriedades Geométricas

### Em 2D

O determinante de uma matriz 2x2 representa a **área do paralelogramo** formado pelos vetores linha (ou coluna) da matriz.

### Em 3D

O determinante de uma matriz 3x3 representa o **volume do paralelepípedo** formado pelos três vetores linha (ou coluna) da matriz.

## Relação com Vetores e Produto Vetorial

### Produto Vetorial em 2D

Para dois vetores em 2D, $\vec{u} = (u_1, u_2)$ e $\vec{v} = (v_1, v_2)$, o "produto vetorial" (na verdade, a componente z do produto vetorial 3D) é:

$$\vec{u} \times \vec{v} = u_1 v_2 - u_2 v_1 = \begin{vmatrix} u_1 & u_2 \\ v_1 & v_2 \end{vmatrix}$$

### Exemplo com Vetores 2D

$$\vec{u} = (3, 2), \quad \vec{v} = (1, 4)$$

$$\vec{u} \times \vec{v} = \begin{vmatrix} 3 & 2 \\ 1 & 4 \end{vmatrix} = 3 \cdot 4 - 2 \cdot 1 = 10$$

Este valor representa a área do paralelogramo formado pelos vetores $\vec{u}$ e $\vec{v}$.

### Produto Vetorial em 3D

Para vetores 3D, $\vec{u} = (u_1, u_2, u_3)$ e $\vec{v} = (v_1, v_2, v_3)$:

$$\vec{u} \times \vec{v} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3 \end{vmatrix}$$

$$= \vec{i}(u_2 v_3 - u_3 v_2) - \vec{j}(u_1 v_3 - u_3 v_1) + \vec{k}(u_1 v_2 - u_2 v_1)$$

### Exemplo com Vetores 3D

$$\vec{u} = (2, 1, 3), \quad \vec{v} = (0, 4, 1)$$

$$\vec{u} \times \vec{v} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ 2 & 1 & 3 \\ 0 & 4 & 1 \end{vmatrix}$$

$$= \vec{i}(1 \cdot 1 - 3 \cdot 4) - \vec{j}(2 \cdot 1 - 3 \cdot 0) + \vec{k}(2 \cdot 4 - 1 \cdot 0)$$

$$= \vec{i}(1 - 12) - \vec{j}(2 - 0) + \vec{k}(8 - 0)$$

$$= -11\vec{i} - 2\vec{j} + 8\vec{k} = (-11, -2, 8)$$

### Produto Misto

O produto misto de três vetores $\vec{u}$, $\vec{v}$ e $\vec{w}$ é dado pelo determinante:

$$\vec{u} \cdot (\vec{v} \times \vec{w}) = \begin{vmatrix} u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3 \\ w_1 & w_2 & w_3 \end{vmatrix}$$

Este valor representa o **volume do paralelepípedo** formado pelos três vetores.

### Exemplo de Produto Misto

$$\vec{u} = (2, 1, 3), \quad \vec{v} = (0, 4, 1), \quad \vec{w} = (1, 2, 2)$$

$$\vec{u} \cdot (\vec{v} \times \vec{w}) = \begin{vmatrix} 2 & 1 & 3 \\ 0 & 4 & 1 \\ 1 & 2 & 2 \end{vmatrix} = 1$$

(Este é o mesmo exemplo calculado anteriormente para a matriz 3x3)

## Interpretações Geométricas

1. **Orientação**: Um determinante positivo indica orientação anti-horária (2D) ou destrogira (3D), enquanto negativo indica horária ou levogira.

2. **Área/Volume**: O valor absoluto do determinante fornece a área (2D) ou volume (3D) da figura geométrica formada pelos vetores.

3. **Colinearidade/Coplanaridade**: 

      - Se det = 0 em 2D, os vetores são colineares
      - Se det = 0 em 3D, os vetores são coplanares

## Aplicações em Computação Gráfica

- **Detecção de orientação** de polígonos
- **Cálculo de áreas** de triângulos e polígonos
- **Teste de interseção** entre segmentos de reta
- **Transformações geométricas** (matrizes de transformação)
- **Cálculo de normais** de superfícies usando produto vetorial