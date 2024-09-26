
export class EnemyCard extends Phaser.GameObjects.Container {
    constructor(scene, x, y, cardData, scale = 1) {
        super(scene, x, y);
        // Add card background (rectangle)
        this.height = 300
        this.width = 200
        this.scale = scale
        const background = scene.add.image(0, 0, 'card_bk');
        background.setDisplaySize(this.width, this.height); // Resize the image to fit the card

        const backgroundBorder = scene.add.graphics();
        backgroundBorder.lineStyle(1, 0x808080);  // 4px thick gray border (hex code for gray is #808080)
        backgroundBorder.strokeRoundedRect(
             - this.width / 2,   // Adjust x position to fit border
            - this.height / 2,   // Adjust y position to fit border
            this.width,                 // Width of the border
            this.height,                 // Height of the border
            10                        // Radius for rounded corners
        );
        this.add(background); // Add background to the container
        this.add(backgroundBorder); // Add background to the container

        // Add a transparent red layer over the background and border
        const redOverlay = scene.add.graphics();
        redOverlay.fillStyle(0xff0000, 0.09);  // Red color (0xff0000) with 50% transparency (0.5 alpha)
        redOverlay.fillRoundedRect(
            - this.width / 2,   // Adjust x position to fit overlay
            - this.height / 2,   // Adjust y position to fit overlay
            this.width,                 // Width of the overlay
            this.height,                 // Height of the overlay
            10                        // Radius for rounded corners
        );
        this.add(redOverlay)


        // Add developer's name
        const nameText = scene.add.text(0, -this.height / 2 + 20, cardData.fullname, {
            fontSize: '18px',
            fill: '#000',
            wordWrap: {width: 10},
            align: 'center'
        });

        nameText.x = -nameText.width / 2
        this.add(nameText); // Add name text to the container

// Add the preloaded image as the card's image
        let img_size = this.width - 50;
        console.log(img_size);
        let img_y = -(this.height / 2 - img_size / 2) + nameText.height + 22;
        const image = scene.add.image(0, img_y, 'enemy_' + cardData.id);
        image.setDisplaySize(img_size, img_size); // Resize the image to fit the card

// Add gray rounded border around the image
        const imageBorder = scene.add.graphics();
        imageBorder.lineStyle(3, 0xFF0000);  // 4px thick gray border (hex code for gray is #808080)
        imageBorder.strokeRoundedRect(
            image.x - img_size / 2,   // Adjust x position to fit border
            image.y - img_size / 2,   // Adjust y position to fit border
            img_size,                 // Width of the border
            img_size,                 // Height of the border
            10                        // Radius for rounded corners
        );

// Add border first to be behind the image
        this.add(image);
        this.add(imageBorder);

        // Add up to 3 skills if they exist
        const skills = Array.isArray(cardData.skills) ? cardData.skills.slice(0, 3) : [];
        let skills_y = image.y + img_size / 2 + 10
        skills.forEach((skill, index) => {
            const skillText = scene.add.text(- this.width/2 + 30, skills_y + index * 16, `${skill.name}`, {
                fontSize: '12px',
                fill: '#000'
            });
            this.add(skillText); // Add each skill text to the container
        });

        // Make the container interactive
        this.setSize(this.width, this.height);
        this.setInteractive(new Phaser.Geom.Rectangle(0, -0, this.width, this.height), Phaser.Geom.Rectangle.Contains);

        // Enable dragging for the card
        scene.input.setDraggable(this);
        scene.add.existing(this); // Add this card to the scene
    }
}