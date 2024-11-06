import { GameObjects, Physics, Scene } from "phaser";

class Circle extends GameObjects.Arc {
  arcadeBody: Physics.Arcade.Body;

  constructor(game: Game, x: number, y: number, radius: number, color: number) {
    super(game, x, y, radius, 0, 360, false, color);

    const speed = Math.random() * 100 + 100;

    game.add.existing(this);

    this.arcadeBody = game.physics.add.existing(this)
      .body as Physics.Arcade.Body;

    this.arcadeBody.setCollideWorldBounds(true);
    this.arcadeBody.setBounce(1);
    this.arcadeBody.setCircle(radius);

    game.physics.moveTo(
      this,
      Phaser.Math.Between(0, game.camera.width),
      Phaser.Math.Between(0, game.camera.height),
      speed
    );
  }
}

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  circles: Circle[];

  constructor() {
    super({
      key: "Game",
      physics: {
        default: "arcade",
        arcade: {
          // debug: true,
        },
      },
    });
    this.circles = [];
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xffffff);

    this.physics.world.setBounds(0, 0, this.camera.width, this.camera.height);
    this.physics.world.setBoundsCollision(true, true, true, true);

    for (const _ of Array(30).keys()) {
      const circle = new Circle(
        this,
        Math.random() * this.camera.width,
        Math.random() * this.camera.height,
        20 + Math.random() * 20,
        0x00000
      );
      this.circles.push(circle);
    }

    this.input.on('pointerdown', () => {
      this.physics.pause();
    });

    this.input.on('pointerup', () => {
      this.physics.resume();
    });
  }


  update() {
    this.physics.collide(this.circles);
  }
}
