const cors = require('cors');
const express = require('express');
require('dotenv').config();


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const app = express();

//Middlewares here
app.use(express.json());
app.use(cors());

//Routes here
app.get('/', (req, res) => {
    res.send('hello stripe!!!');
});

//post route
app.post('/api/create-checkout-session', async (req, res) => {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: product.quantity,
            },
        ],
        mode: "payment",
        success_url: "http://localhost:3002/success",
        cancel_url: "http://localhost:3002/cancel",
    });
    res.json({ id: session.id });
})

//listen
app.listen(3000, () => {
    console.log('server started at port 3000');
})