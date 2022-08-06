import SendbirdChat from "your_path_to_sdk/sendbird.js";
import { GroupChannelModule } from "your_path_to_sdk/groupChannel.js";

const sendbird = SendbirdChat.init({
  appId,
  modules: [new GroupChannelModule()],
});
try {
  const user = await sendbird.connect("FA94649C-320E-45FF-9E11-5C61CBD045D4");
  // The user is connected to the Sendbird server.
} catch (err) {
  // Handle error.
}
