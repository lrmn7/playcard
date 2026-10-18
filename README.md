<br />
<p align="center">
  <h1 align="center">P L A Y C A R D</h1>
  <p align="center"> Playcard is a futuristic music card library designed for Discord bots.
    <br />
    <br />
    <a href="https://github.com/lrmn7">Report Issues & Give Suggestions</a>
    ·
    <a href="https://discord.com/oauth2/authorize?client_id=928711702596423740&permissions=8&scope=bot+applications.commands">Invite</a>
    ·
    <a href="https://discord.gg/Bxrj3CYvPK">Support Server</a>
  </p>

# __Installation__
```
npm install playcard
yarn add playcard
pnpm install playcard
```

# __Example__
This example code will generate a music card image and save it.
```js
(async () => {
    const { Playcard } = require("playcard");
    const fs = require("fs");

    const card = new Playcard()
        .setName("Bunga Hati")
        .setAuthor("Salma Salsabil")
        .setTheme("sore") // "sore" or "listune"
        .setThumbnail("https://i.ibb.co.com/MyW2pDvn/sore-logo.png")
        .setRequester("L RMN");

    const cardBuffer = await card.build();

    fs.writeFileSync(`card.png`, cardBuffer);
    console.log("Done!");
})();
```

# __Available Themes__
- `sore`
- `listune`
