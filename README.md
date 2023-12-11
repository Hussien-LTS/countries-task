# countries-API

Welcome to **countries-API!** This project is built with Node.js and Prisma, using PostgreSQL as the database.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

## Getting Started

1. Clone the repository:

    ```bash
    git clone git@github.com:Hussien-LTS/countries-task.git
    ```

2. Navigate to the project directory:

    ```bash
    cd countries-task
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up your PostgreSQL database:

    - Create a new PostgreSQL database.
    - Copy the `.env.example` file to a new file named `.env` and update the database connection details.

5. Run database migrations:

    ```bash
    npx prisma migrate dev
    ```

6. Start the application:

    ```bash
    npm start
    ```

- The application should now be running at `http://localhost:3000`.

## Scripts

- `npm start`: Build TypeScript, run migrations, seed the database, and start the server.
- `npm run prisma:generate`: Generate Prisma client.
- `npm run prisma:migrate`: Run Prisma migrations.
- `npm run seed:database`: Seed the database with initial data.
- `npm run start:typescript`: Compile TypeScript.
- `npm run start:server`: Start the server.

## Routes

- `GET http://localhost:3000/countries/all`: Get all countries.

- `GET http://localhost:3000/countries/search`: Search for countries either By
**CCA2/CCA3/CCN3 country name (common name or official name)**.

- `GET http://localhost:3000/countries/get-currency/:cca2`: Get currencies of a specific country By **CCA2**.

- `GET http://localhost:3000/countries/group-country/:valueToGroupBy`: Group countries by a specified value By **region or language**.

- `GET http://localhost:3000/countries/download`: Download data only **if the request contains the header "X-ADMIN=1"**.

## Decoding the giving API URL

`01101100 01101100 01100001 00101111 00110001 00101110 00110011 01110110
00101111 01101101 01101111 01100011 00101110 01110011 01100101 01101001 01110010
01110100 01101110 01110101 01101111 01100011 01110100 01110011 01100101 01110010
00101111 00101111 00111010 01110011 01110000 01110100 01110100 01101000`
