## About
Welcome to the 3D Herbarium repository. This is a [Next.js](https://nextjs.org/) project with a [MySQL](https://www.mysql.com/) database accessed via [Prisma ORM](https://www.prisma.io/). Authentication is through nextauth.js.

As we finalize our new version updates, we will be publishing additional reference documentation for the creation of 3D models, post production and more. The main branch of this repo will be the production branch once updates are stable.

## Initialization

Before the program will run, you will need to create and host a database, initialize a [Prisma ORM](https://www.prisma.io/) client with .env file, and get a [plant.id](https://plant.id/) api key if you wish to use that feature. The preconfigured Oauth2 providers are Google, Sketchfab and iNaturalist. A premium sketchfab account is also required for all model viewer initialization options.

## Database

We use and recommend a [MySQL](https://www.mysql.com/) database, but others can be used through Prisma ORM and the schema is included in the Prisma folder.

Simply create and host your database locally or online, then [configure](https://www.prisma.io/docs/orm/prisma-client) your Prisma client (if your schema differs at all) and .env file to access your database.

## Plant.id

To use the plant.id feature, you will need to acquire a FREE key from their [website](https://plant.id/). Simply store it in you .env file as 'PLANT.ID_KEY' and you're good to go. Note that this feature will be instrumental 
in the code in coming updates.

## 3D Models

Check back here for updates regarding 3D modeling documentation. [Sketchfab](https://sketchfab.com/developers/viewer) is our 3D model hosting provider; a premium account is required for many of the viewer api initialization options in the code (such as watermark removal)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

