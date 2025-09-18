# Transformações 2D

As transformações 2D são operações que alteram a posição, orientação ou tamanho de objetos em um espaço bidimensional. As principais transformações 2D são: [translação](translation.md), [rotação](rotation.md) e [escala](scaling.md). Essas transformações são fundamentais em computação gráfica e são amplamente utilizadas em bibliotecas como p5.js para manipular gráficos e criar animações.

Embora possa parecer que as transformações alteram diretamente os objetos, na verdade elas **modificam o sistema de coordenadas** no qual os objetos são desenhados. Isso significa que, ao aplicar uma transformação, você está mudando a forma como o sistema de coordenadas interpreta as posições dos objetos, e não os objetos em si.

Cada transformação pode ser representada por uma matriz, e a combinação de múltiplas transformações pode ser realizada através da multiplicação dessas matrizes. A ordem das transformações é crucial, pois elas são aplicadas sequencialmente, e diferentes ordens podem resultar em efeitos visuais distintos.

