const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { getPaymentStatus } = require('../api/payment-status/paymentStatusStore');
const { MercadoPagoConfig } = require('mercadopago');
const webhookRoutes = require('./routes/webhook');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do cliente Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// Endpoint de verificação de status
app.get('/payment-status/:id', (req, res) => {
    const paymentId = req.params.id;
    const status = getPaymentStatus(paymentId);
    res.json({ status });
});

/* Pix */
const { Payment } = require('mercadopago');
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

        const payment = await new Payment(client).create(payment_data);

        return res.status(200).json(payment.point_of_interaction.transaction_data.qr_code_base64);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar pagamento Pix' });
    }
});

/* Boleto */
app.post('/create-boleto', async (req, res) => {
    const { amount, description, email, first_name, last_name } = req.body;

    try {
        const payment = await new Payment(client).create({
            transaction_amount: amount,
            description,
            payment_method_id: 'bolbradesco',
            payer: {
                email,
                first_name,
                last_name,
            },
        });

        res.json({
            boleto_url: payment.transaction_details.external_resource_url,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar boleto');
    }
});

/* Webhook separado */
app.use('/webhook', webhookRoutes(client));

// Porta do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});
