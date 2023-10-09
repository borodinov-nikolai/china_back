const emailTemplate = (user) => {
  return {
    subject: 'Show Chinese',
    text: `Show Chinese`,
    html: `<h4>Уведомление с сайта Show Chinese</h4>
            <h4>Здравствуйте ${user.username}, у вас осталось меньше 3-ёх дней подписки</h4>
            <h4>Для продления оплаты нажмите на кнопку </h4>
            <a href="https://showchinese.ru/profile/subscription" style="background-color: #72b172; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Продлить</a>
         <hr style="margin: 10px 0;"/>
         <h4>Notification from the Show Chinese</h4>
         <h4> Hello ${user.username}, you have less than 3 days of subscription left</h4>
         <h4>To extend the payment, click </h4>
         <a href="https://showchinese.ru/profile/subscription" style="background-color: #72b172; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Extend</a>
         <p>Thanks, <a href="https://showchinese.ru" style="text-decoration: none; color: #72b172; font-size: large">Show Chinese.</a></p>`
  };
};


export default {

  email: {
    task: async ({strapi}) => {
      const array = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          fields: ["username", "email"],
          populate: {subscriptions: true},
        }
      );
      const users = array.filter((user) => user.subscriptions.length > 0);
      const usersSubs = users.map(user => {
        const activeSubscriptions = user.subscriptions.filter((sub) => sub.isActive);
        return { ...user, subscriptions: activeSubscriptions };
      }).filter(user => user.subscriptions.length > 0);

      const currentDate = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(currentDate.getDate() + 3);
      const filteredUsers = usersSubs.filter(user => {
        const dueToDayParts = user.subscriptions[0].dueToDay.split('-');
        const dueToDay = new Date(
          dueToDayParts[0], // год
          dueToDayParts[1] - 1, // месяц
          dueToDayParts[2] // день
        );
        return dueToDay < threeDaysFromNow && dueToDay >= currentDate;
      });
      for (const user of filteredUsers) {
        await strapi.plugins['email'].services.email.sendTemplatedEmail({
            to: user.email
          },
          emailTemplate(user))
      }
    },
    options: {
      rule: "0 9 * * *",
    },
  },
  translateLimit: {
    task: async ({strapi}) => {
      await strapi.db.query("api::limitation.limitation").updateMany({
        data: {
          translateLimit: 40,
        },
      });
    },
    options: {
      rule: "0 0 * * *",
    },
  },
};
