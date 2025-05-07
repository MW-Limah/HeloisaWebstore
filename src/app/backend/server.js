const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configuração do cliente Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* Pix */
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
            payment_method_id: 'bolbradesco', // Boleto Bradesco
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

/* Webhook */
app.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;

            const payment = await new Payment(client).get({ id: paymentId });

            if (payment.status === 'approved') {
                console.log('Pagamento aprovado:', {
                    id: payment.id,
                    valor: payment.transaction_amount,
                    comprador: payment.payer.email,
                    método: payment.payment_method_id,
                });

                // Simulação de atualização de pedido
                // await Pedido.findByIdAndUpdate(data.order_id, { status: 'pago' });
            } else {
                console.log('Pagamento não aprovado ainda:', payment.status);
            }
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('Erro no webhook:', err);
        res.status(500).send('Erro no webhook');
    }
});

// Porta do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});
