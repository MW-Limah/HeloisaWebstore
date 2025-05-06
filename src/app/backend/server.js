const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'TEST-5619784803285063-050418-22f1f195a5c66c6801e4e5ba01c58263-2419640875',
});

/* Pix */

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/create-pix', async (req, res) => {
    try {
        const payment_data = {
            transaction_amount: req.body.amount,
            description: req.body.description,
            payment_method_id: 'pix',
            payer: {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
            },
        };

        const payment = await mercadopago.payment.create(payment_data);

        return res.status(200).json(payment.body.point_of_interaction.transaction_data.qr_code_base64);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar pagamento Pix' });
    }
});

/* Boleto */

app.post('/create-boleto', async (req, res) => {
    const { amount, description, email, first_name, last_name } = req.body;

    try {
        const payment = await mercadopago.payment.create({
            transaction_amount: amount,
            description,
            payment_method_id: 'bolbradesco', // Boleto
            payer: {
                email,
                first_name,
                last_name,
            },
        });

        res.json({ boleto_url: payment.body.transaction_details.external_resource_url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar boleto');
    }
});

// No backend/server.js ou backend/index.js
app.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;

            const payment = await mercadopago.payment.findById(paymentId);

            if (payment.body.status === 'approved') {
                console.log('Pagamento aprovado:', {
                    id: payment.body.id,
                    valor: payment.body.transaction_amount,
                    comprador: payment.body.payer.email,
                    método: payment.body.payment_method_id,
                });

                // Atualize o status do pedido no banco de dados
                await Pedido.findByIdAndUpdate(data.order_id, { status: 'pago' });
            } else {
                console.log('Pagamento não aprovado ainda:', payment.body.status);
            }
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('Erro no webhook:', err);
        res.status(500).send('Erro no webhook');
    }
});
