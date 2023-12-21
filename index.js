const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")("<secret key>");
const bodyParser = require('body-parser');
const YOUR_DOMAIN = "http://localhost:8000";

// static files
// app.use(express.static(path.join(__dirname, "views")));
app.set('view engine', 'ejs');
 app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// middleware
app.use(express.json());
app.get('/',(req,res)=>{
    res.render('checkout')
})
app.get('/success',(req,res)=>{
    res.render('success')
})
app.get('/cancel',(req,res)=>{
    res.render('cancel')
})
// routes
app.post("/payment", async (req, res) => {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: product.amount * 100,
                },
                quantity: product.quantity,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.json({ id: session.id });
});

// listening...
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
