# Combinação de transformações

As transformações podem ser combinadas para criar efeitos mais complexos. A ordem das transformações é crucial, pois elas são aplicadas sequencialmente. Por exemplo, considere o seguinte sketch que combina translação, rotação e escala para desenhar várias casas em diferentes posições.

<div class="sketch-runner"
     data-sketch-path="../demo-combined.js"
     data-width="600"
     data-height="200"
     data-title="Grupo de casas com transformações combinadas"
>
</div>

O código define a classe `House`, que possui um método `display()` responsável por desenhar a casa na posição `(0, 0)` após aplicar as transformações de translação, rotação e escala.

```javascript
class House {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    display() {
        push();

        translate(this.x, this.y); // (1)!
        rotate(PI / 4); // (2)! 
        scale(1.5, 0.5); // (3)!

        triangle(15, 0, 0, 15, 30, 15);
        rect(0, 15, 30, 30);
        rect(12, 30, 10, 15);

        pop();
    }
}

houses = [];
const HOUSE_STEP = 70;

function setup() {
    createCanvas(600, 200);
    const houseY = height / 2 - 30;

    for (let i = 50; i < width; i += HOUSE_STEP) {
        houses.push(new House(i, houseY));
    }

}
function draw() {
    background(255);
    houses.forEach((house, index) => {
        house.display();
    });
}
```

1. Translação do sistema de coordenadas para a posição da casa, na coordenada `(x, y)`.
2. Rotação do sistema de coordenadas em torno da origem em \( 45^\circ \).
3. Escala do sistema de coordenadas (1.5x em x e 0.5x em y).

O método `display()` da classe `House` aplica as transformações na seguinte ordem:

1. Translação para a posição da casa.
2. Rotação de \( 45^\circ \).
3. Escala de \( 1.5 \) na direção x e \( 0.5 \) na direção y.

Essas transformações são aplicadas entre `push()` e `pop()`, garantindo que o estado do sistema de coordenadas seja restaurado após desenhar cada casa. Isso permite que cada casa seja desenhada de forma independente, sem interferir nas outras.

