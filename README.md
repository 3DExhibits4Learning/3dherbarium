This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Initialization

Before the code will run, you will need to create and host a database, initialize a [Prisma](https://www.prisma.io/) client with .env file, and get a [plant.id](https://plant.id/) api key.

## Database

We use and recommend a [MySQL](https://www.mysql.com/) database, but others can be used through Prisma ORM and the schema is included in the Prisma folder.

Simply create and host your database locally or online, then [configure](https://www.prisma.io/docs/orm/prisma-client) your Prisma client (if your schema differs at all) and .env file to access your database.

## Plant.id

To use the plant.id feature, you will need to acquire a FREE key from their [website](https://plant.id/). Create a file called 'plantid.js,' in your top level and export your key from there.

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
