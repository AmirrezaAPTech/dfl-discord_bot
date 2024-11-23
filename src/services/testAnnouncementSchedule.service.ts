import { Client, TextChannel } from "discord.js";
import moment from "moment-timezone";

const announcementChannelId = "1292794241457586239";
const messageContent =
  "🌱 رمز امروز: \n \n  هر چی سخت‌تر کار کنم، شانس بیشتری سراغم میاد. \n \n 📝 موضوع جورنالینگ: \n \n بزرگترین نقدی که به خودم دارم اینه که...";

export const scheduleAnnouncement = (client: Client) => {
  // Get current time in Tehran (Iran Standard Time)
  const now = moment().tz("Asia/Tehran");

  // Set the target time for today at 4:30 AM in Tehran time
  const target = moment()
    .tz("Asia/Tehran")
    .set({ hour: 5, minute: 0, second: 0, millisecond: 0 });

  // If the target time is already in the past today, schedule for the next day
  if (target.isBefore(now)) {
    target.add(1, "days");
  }

  // Calculate the delay in milliseconds
  const delay = target.diff(now);

  console.log(
    `Scheduled announcement at 4:30 AM Tehran Time. Delay: ${delay}ms`
  );

  // Schedule the message using setTimeout
  setTimeout(async () => {
    try {
      const announcementChannel = client.channels.cache.get(
        announcementChannelId
      ) as TextChannel;

      if (!announcementChannel) {
        console.error("Announcement channel not found!");
        return;
      }

      await announcementChannel.send(messageContent);
      console.log("Announcement sent successfully!");
    } catch (error) {
      console.error("Failed to send announcement:", error);
    }
  }, delay);
};
