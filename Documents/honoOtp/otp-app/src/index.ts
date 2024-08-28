import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {config} from 'dotenv'
import {Client} from 'pg'
import { logger } from 'hono/logger'
import{ createProfile } from './controllers/profileController'
import {otpRoutes} from './routes'
config();
const app = new Hono()
app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/users', (c) => {
  console.log("Received a POST request to /users");
  return createProfile(c);
});

app.route('/otp',otpRoutes)

const port = 3550
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
////////////////////////////////////
const dbconfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca:process.env.DB_CA
    },
};

const client = new Client(dbconfig);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});