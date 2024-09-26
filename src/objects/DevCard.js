export class DevCard extends Phaser.GameObjects.Container {
    constructor(scene, x, y, cardData, scale = 1) {
        super(scene, x, y);

        this.height = 300;
        this.width = 200;
        this.scale = scale;

        // Add the card background
        const background = scene.add.image(0, 0, 'card_bk');
        background.setDisplaySize(this.width, this.height); // Resize the image to fit the card

        const backgroundBorder = scene.add.graphics();
        backgroundBorder.lineStyle(1, 0x808080);  // Gray border
        backgroundBorder.strokeRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,
            10
        );

        this.add(background);
        this.add(backgroundBorder);

        // Developer's name
        const nameText = scene.add.text(0, -this.height / 2 + 20, cardData.fullname, {
            fontSize: '18px',
            fill: '#000',
            align: 'center',
            wordWrap: { width: this.width - 20 },
        });
        nameText.x = -nameText.width / 2;
        this.add(nameText);

        // Developer's image
        let img_size = this.width - 50;
        let img_y = -(this.height / 2 - img_size / 2) + nameText.height + 22;
        const image = scene.add.image(0, img_y, 'dev_' + cardData.id);
        image.setDisplaySize(img_size, img_size);

        const imageBorder = scene.add.graphics();
        imageBorder.lineStyle(1, 0x808080);
        imageBorder.strokeRoundedRect(
            image.x - img_size / 2,
            image.y - img_size / 2,
            img_size,
            img_size,
            10
        );

        this.add(image);
        this.add(imageBorder);

        // Skills
        const skills = Array.isArray(cardData.skills) ? cardData.skills.slice(0, 3) : [];
        let skills_y = image.y + img_size / 2 + 5;
        skills.forEach((skill, index) => {
            const skillText = scene.add.text(-this.width / 2 + 30, skills_y + index * 16, `${skill.name}`, {
                fontSize: '12px',
                fill: '#000'
            });
            this.add(skillText);
        });

        // Store the background and image for tint effect
        this.background = background;
        this.image = image;

        // Make the container interactive
        this.setSize(this.width, this.height);
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width, this.height), Phaser.Geom.Rectangle.Contains);

        // Enable dragging for the card
        scene.input.setDraggable(this);
        scene.add.existing(this);

        // Add hover effect
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);

        // Add events for drag start and drag end
        scene.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject === this) {
                this.onDragStart();
            }
        });

        scene.input.on('dragend', (pointer, gameObject) => {
            if (gameObject === this) {
                this.onDragEnd();
            }
        });
    }

    // Hover over effect (make the card "shine")
    onPointerOver() {
        // Slightly increase brightness (lighter tint)
        this.background.setTint(0xFFFFAA);  // Lighter tint
        this.image.setTint(0xFFFFAA);       // Apply tint to the image
    }

    // Hover out effect (reset the tint)
    onPointerOut() {
        // Reset the tint back to normal
        this.background.clearTint();
        this.image.clearTint();
    }

    // Shake and light up when picked up
    onDragStart() {
        // Light up (tint) effect when dragging starts
        this.background.setTint(0xFFFF99);  // Yellowish tint for light effect
        this.image.setTint(0xFFFF99);       // Apply tint to the image

        // Shake effect (using tweens)
        this.scene.tweens.add({
            targets: this,
            angle: { from: -1, to: 1 },  // Shake by rotating
            duration: 50,
            ease: 'Linear',
            yoyo: true,
            repeat: -1 // Repeat infinitely while dragging
        });
    }

    // Reset the card when drag ends
    onDragEnd() {
        // Reset tint
        this.background.clearTint();
        this.image.clearTint();

        // Stop shaking
        this.scene.tweens.killTweensOf(this);  // Kill any active tweens on this object
        this.setAngle(0);  // Reset angle to 0
    }
}