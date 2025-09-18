# Trigonometria

A **trigonometria** é fundamental em Computação Gráfica, pois permite descrever movimentos, rotações e posições de objetos no espaço. Este capítulo revisa conceitos essenciais e apresenta novas ideias importantes para aplicações gráficas.

## O Dispositivo SOH-CAH-TOA

<figure markdown="span">
     ![alt text](diagram-soh-cah-toa.png){width="400"}
     <figcaption>Dispositivo SOH-CAH-TOA</figcaption>
</figure>

O dispositivo **SOH-CAH-TOA** ajuda a lembrar as definições das funções trigonométricas em um triângulo retângulo:

- **SOH**: Seno é igual ao cateto Oposto sobre a Hipotenusa (*Sine = Opposite / Hypotenuse*)
- **CAH**: Cosseno é igual ao cateto Adjacente sobre a Hipotenusa (*Cosine = Adjacent / Hypotenuse*)
- **TOA**: Tangente é igual ao cateto Oposto sobre o Adjacente (*Tangent = Opposite / Adjacent*)

Matematicamente, temos:

$$
\begin{align}
    \sin \theta &= \frac{\text{oposto}}{\text{hipotenusa}} \\[10pt]
    \cos \theta &= \frac{\text{adjacente}}{\text{hipotenusa}} \\[10pt]
    \tan \theta &= \frac{\text{oposto}}{\text{adjacente}} \\[10pt]
    \tan \theta &= \frac{\sin \theta}{\cos \theta}
\end{align}
$$

## O Círculo Unitário

<figure markdown="span">
     ![alt text](diagram-unit-circle.png){width="500"}
     <figcaption>Círculo unitário</figcaption>
</figure>

O **círculo unitário** é um círculo de raio $r = 1$ centrado na origem. Ele é uma ferramenta poderosa para visualizar e compreender as funções trigonométricas.

No círculo unitário, usamos o **sistema de coordenadas polares** (SCP), onde um ponto é definido por $(r, \theta)$:
- $r$ é o raio (distância até a origem)
- $\theta$ é o ângulo em relação ao eixo $x$ positivo

O ângulo $\theta = 0$ está na direção do eixo $x$ positivo (posição das 3 horas em um relógio) e aumenta no sentido anti-horário.

No diagrama acima, o ponto $p(r, \theta)$ está em $\theta = \frac{\pi}{4}$ radianos ($45^\circ$). Outros pontos importantes:

- $\frac{1}{4}$ da circunferência: $\theta = \frac{\pi}{2}$ ($90^\circ$)
- $\frac{1}{2}$ da circunferência: $\theta = \pi$ ($180^\circ$)
- $\frac{3}{4}$ da circunferência: $\theta = \frac{3\pi}{2}$ ($270^\circ$)

No SCP, os ângulos são geralmente medidos em **radianos**. O comprimento do arco correspondente a um ângulo $\theta$ é dado por $s = r \times \theta$.

## Relação com o Sistema Cartesiano

Dentro do círculo unitário, qualquer ponto na circunferência pode ser convertido para o **sistema de coordenadas cartesianas** (SCC) usando:

$$
\begin{align}
    x &= r \cos \theta \\
    y &= r \sin \theta
\end{align}
$$

No círculo unitário ($r = 1$), isso se simplifica para:

$$
\begin{align}
    x &= \cos \theta \\
    y &= \sin \theta
\end{align}
$$

Ou seja, para cada ângulo $\theta$, o cosseno fornece a coordenada $x$ e o seno fornece a coordenada $y$ do ponto correspondente na circunferência.

## Graus e Radianos

Em computação gráfica e matemática, é comum trabalhar com **radianos** porque eles simplificam fórmulas e cálculos. Um círculo completo tem $2\pi$ radianos, que equivalem a $360^\circ$.

As conversões entre graus ($\alpha$) e radianos ($\theta$) são:

$$
\begin{align}
    \theta &= \frac{\alpha \pi}{180} \\ \\
    \alpha &= \frac{\theta \cdot 180}{\pi}
\end{align}
$$

**Exemplo:**  

$90^\circ = \frac{\pi}{2}$ radianos  
$180^\circ = \pi$ radianos

## Funções em p5.js

A biblioteca p5.js oferece funções úteis para trabalhar com trigonometria:

- `cos(a)`: retorna o cosseno do ângulo `a` (em radianos)
- `sin(a)`: retorna o seno do ângulo `a` (em radianos)
- `radians(a)`: converte o ângulo `a` de graus para radianos

## Exercício Sugerido

Desenhe um ponto no círculo unitário para $\theta = 60^\circ$.  
1. Converta $60^\circ$ para radianos.  
2. Calcule as coordenadas cartesianas $(x, y)$ desse ponto.  
3. Represente graficamente no círculo unitário.
