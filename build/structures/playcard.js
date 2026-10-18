const canvas = require("@napi-rs/canvas");
const path = require("path");
const fs = require("fs");

const fontDir = path.join(__dirname, "font");

function registerFontSafely(fontFileName, fontName) {
    const fontPath = path.join(fontDir, fontFileName);
    if (fs.existsSync(fontPath)) {
        try {
            canvas.GlobalFonts.registerFromPath(fontPath, fontName);
        } catch {
            // Font might already be registered
        }
    }
}

registerFontSafely("circularstd-black.otf", "circular-std");
registerFontSafely("notosans-jp-black.ttf", "noto-sans-jp");
registerFontSafely("notosans-black.ttf", "noto-sans");
registerFontSafely("notoemoji-bold.ttf", "noto-emoji");
registerFontSafely("notosans-kr-black.ttf", "noto-sans-kr");

const SORE_BACKGROUNDS = [
    "https://i.ibb.co.com/BK2xgrt4/sore-music-card.png",
    "https://i.ibb.co.com/KpHmFFfq/sore-music-card-1.png",
    "https://i.ibb.co.com/5xFvTVRR/sore-music-card-2.png",
    "https://i.ibb.co.com/rKTyb6d1/sore-music-card-3.png",
    "https://i.ibb.co.com/dXcgVwJ/sore-music-card-4.png",
    "https://i.ibb.co.com/fVvk6gWN/sore-music-card-5.png",
    "https://i.ibb.co.com/WvTrrxtn/sore-music-card-6.png"
];

const LISTUNE_BACKGROUNDS = [
    "https://i.ibb.co.com/NnJ82V0s/listune-music-card.png"
];

class Playcard {
    constructor(options) {
        this.name = options?.name ?? null;
        this.author = options?.author ?? null;
        this.color = options?.color ?? null;
        this.theme = options?.theme ?? 'sore';
        this.brightness = options?.brightness ?? null;
        this.thumbnail = options?.thumbnail ?? null;
        this.progress = options?.progress ?? null;
        this.starttime = options?.startTime ?? null;
        this.endtime = options?.endTime ?? null;
        this.requester = options?.requester != null ? `${options.requester}` : null;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setAuthor(author) {
        this.author = author;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setTheme(theme) {
        this.theme = theme || 'sore';
        return this;
    }

    setBrightness(brightness) {
        this.brightness = brightness;
        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }

    setProgress(progress) {
        this.progress = progress;
        return this;
    }

    setStartTime(starttime) {
        this.starttime = starttime;
        return this;
    }

    setEndTime(endtime) {
        this.endtime = endtime;
        return this;
    }

    setRequester(requester) {
        this.requester = `${requester}`;
        return this;
    }

    async build() {
        if (!this.name) throw new Error('Missing name parameter');
        if (!this.author) throw new Error('Missing author parameter');
        if (!this.requester) throw new Error('Missing requester parameter');
        if (!this.theme) this.setTheme('sore');

        const selectedTheme = (this.theme || 'sore').toLowerCase();
        let backgroundUrl;
        let defaultThumbnail;

        if (selectedTheme === 'sore' || selectedTheme === 'sorecard') {
            backgroundUrl = SORE_BACKGROUNDS[Math.floor(Math.random() * SORE_BACKGROUNDS.length)];
            defaultThumbnail = 'https://i.ibb.co.com/MyW2pDvn/sore-logo.png';
        } else if (selectedTheme === 'listune' || selectedTheme === 'listunecard') {
            backgroundUrl = LISTUNE_BACKGROUNDS[Math.floor(Math.random() * LISTUNE_BACKGROUNDS.length)];
            defaultThumbnail = 'https://i.ibb.co.com/PZw2j7Fy/listune-logo.png';
        } else {
            throw new Error('Invalid theme parameter, must be "sore" | "listune"');
        }

        if (!this.thumbnail) this.setThumbnail(defaultThumbnail);

        if (this.name.replace(/\s/g, '').length > 15) this.name = `${this.name.slice(0, 15)}...`;
        if (this.author.replace(/\s/g, '').length > 15) this.author = `${this.author.slice(0, 15)}`;
        if (this.requester.replace(/\s/g, '').length > 12) this.requester = `${this.requester.slice(0, 10)}...`;

        const frame = canvas.createCanvas(800, 200);
        const ctx = frame.getContext("2d");

        const background = await canvas.loadImage(backgroundUrl);
        ctx.drawImage(background, 0, 0, frame.width, frame.height);

        let thumbnailImage;

        try {
            thumbnailImage = await canvas.loadImage(this.thumbnail, {
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    }
                }
            });
        } catch (error) {
            console.error('PLAYCARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
            thumbnailImage = await canvas.loadImage(defaultThumbnail);
        }

        const thumbX = 85;
        const thumbY = 34;
        const thumbWidth = 137;
        const thumbHeight = 137;
        const thumbRadius = 15;
        const targetAspect = thumbWidth / thumbHeight;
        const imageAspect = thumbnailImage.width / thumbnailImage.height;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = thumbnailImage.width;
        let sourceHeight = thumbnailImage.height;

        if (imageAspect > targetAspect) {
            sourceWidth = thumbnailImage.height * targetAspect;
            sourceX = (thumbnailImage.width - sourceWidth) / 2;
        } else {
            sourceHeight = thumbnailImage.width / targetAspect;
            sourceY = (thumbnailImage.height - sourceHeight) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(thumbX + thumbRadius, thumbY);
        ctx.arcTo(thumbX + thumbWidth, thumbY, thumbX + thumbWidth, thumbY + thumbHeight, thumbRadius);
        ctx.arcTo(thumbX + thumbWidth, thumbY + thumbHeight, thumbX, thumbY + thumbHeight, thumbRadius);
        ctx.arcTo(thumbX, thumbY + thumbHeight, thumbX, thumbY, thumbRadius);
        ctx.arcTo(thumbX, thumbY, thumbX + thumbWidth, thumbY, thumbRadius);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
            thumbnailImage,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            thumbX,
            thumbY,
            thumbWidth,
            thumbHeight
        );
        ctx.restore();

        const allowedColors = ['#77797c', '#0641c7', '#967e58', '#628fa4', '#d34d52', '#f00c8f'];

        function getRandomColor() {
            return allowedColors[Math.floor(Math.random() * allowedColors.length)];
        }

        ctx.font = "bold 50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
        ctx.fillStyle = getRandomColor();
        ctx.fillText(this.name, 250, 103);

        const authorText = this.author;
        ctx.fillStyle = getRandomColor();
        ctx.font = "bold 34px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
        ctx.fillText(authorText, 250, 143);

        const authorTextWidth = ctx.measureText(authorText).width;

        const requesterText = this.requester;
        ctx.fillStyle = getRandomColor();
        ctx.font = "bold 34px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr";
        ctx.fillText(requesterText, 250 + authorTextWidth + 10, 143);

        return frame.toBuffer("image/png");
    }
}

const playcard = Playcard;

module.exports = {
    Playcard,
    playcard
};
