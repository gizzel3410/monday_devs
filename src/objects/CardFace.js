export class CardFace extends Phaser.GameObjects.Container {
    constructor(scene, x, y, person) {
        super(scene, x, y);

        this.person = person;

        // Card dimensions
        const cardWidth = 150;
        const cardHeight = 250;

        // Create card background
        const cardBg = scene.add.rectangle(0, 0, cardWidth, cardHeight, 0xffffff).setOrigin(0.5);
        this.add(cardBg);

        // Load the profile picture (you can also preload the image in the main scene if you prefer)
        const profilePic = scene.add.image(0, -cardHeight / 2 + 80, 'profile-pic').setScale(0.5);
        this.add(profilePic);

        // Add name text
        const nameText = scene.add.text(0, -cardHeight / 2 + 160, this.person.fullname, {
            font: '18px Arial',
            color: '#000',
            align: 'center'
        }).setOrigin(0.5);
        this.add(nameText);

        // Add skills
        const skillsText = scene.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 200, 'Skills:', {
            font: '16px Arial',
            color: '#000'
        });
        this.add(skillsText);

        // List the skills
        if (this.person.skills)
            this.person.skills.forEach((skill, index) => {
                const skillText = `${skill.name} (Level: ${skill.level})`;
                const skillTextObject = scene.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 230 + index * 20, skillText, {
                    font: '14px Arial',
                    color: '#000'
                });
                this.add(skillTextObject);
            });

        // Add to the scene
        scene.add.existing(this);
    }
}