const rabbitMQ = require("amqplib/callback_api");
const ON_DEATH = require("death");

const sendPusblish = (exchange, routerKey, msgPayload) => {
  rabbitMQ.connect(process.env.RABBIT_MQ_URL, (connectError, connection) => {
    if (connectError) {
      throw connectError;
    }

    connection.createChannel((channelError, channel) => {
      if (channelError) {
        throw channelError;
      }

      channel.assertExchange(exchange, "direct", { durable: true });
      channel.publish(exchange, routerKey, Buffer.from(msgPayload));
    });

    ON_DEATH((signal, error) => {
      setTimeout(() => {
        connection.close();
        process.emit(0);
      }, 500);
    });
  });
};

module.exports = { sendPusblish };
