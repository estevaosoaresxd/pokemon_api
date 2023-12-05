const rabbitMQ = require("amqplib/callback_api");
const ON_DEATH = require("death");

const sendPusblish = (exchange, routerKey, msgPayload) => {
  rabbitMQ.connect(process.env.RABBIT_MQ_URL, (connectError, connection) => {
    if (connectError) {
      const msg = "Erro ao criar o canal.";

      logger.log("error", msg);

      throw connectError;
    }

    connection.createChannel((channelError, channel) => {
      if (channelError) {
        const msg = "Erro ao conectar ao canal.";

        logger.log("error", msg);

        throw channelError;
      }

      channel.assertExchange(exchange, "direct", { durable: true });
      channel.publish(exchange, routerKey, Buffer.from(msgPayload));
    });

    ON_DEATH((signal, error) => {
      if (error) {
        const msg = "Erro durante a fila.";

        logger.log("error", msg);
      }

      setTimeout(() => {
        connection.close();
        process.emit(0);
      }, 500);
    });
  });
};

module.exports = { sendPusblish };
