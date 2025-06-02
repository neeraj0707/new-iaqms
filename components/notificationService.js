import * as Notifications from "expo-notifications";
// import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true,
    shouldShowBanner: true, // replaces shouldShowAlert
    shouldShowList: true,   // replaces shouldShowAlert
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// AQI ranges and messages
const AQI_RANGES = {
  good: {
    min: 0,
    max: 50,
    message: "Air quality is good!",
    color: "#00E400",
    emoji: "😊",
  },
  moderate: {
    min: 51,
    max: 100,
    message: "Moderate air quality",
    color: "#FFFF00",
    emoji: "😐",
  },
  poor: {
    min: 101,
    max: 150,
    message: "Air quality is poor!",
    color: "FF7E00",
    emoji: "😒",
  },
  unhealthy: {
    min: 151,
    max: 200,
    message: "Air quality is unhealthy.",
    color: "#AA0000",
    emoji: "😷",
  },
  severe: {
    min: 201,
    max: 300,
    message: "Air quality is very severe",
    color: "#662d91",
    emoji: "😵",
  },
  hazardous: {
    min: 301,
    max: 500,
    message: "Air quality is hazardous.",
    color: "#6E260E",
    emoji: "🤢",
  },
};

// Track previous AQI range
let previousRange = null;

// Send notification when AQI range changes
export async function checkAndNotifyAQIChange(currentAQI) {
  // Determine current range
  let currentRange = null;

  for (const [range, values] of Object.entries(AQI_RANGES)) {
    if (currentAQI >= values.min && currentAQI <= values.max) {
      currentRange = range;

      break;
    }
  }

  // If range changed, send notification
  if (currentRange && currentRange !== previousRange) {
    const { message, emoji } = AQI_RANGES[currentRange];
    await sendAQINotification(
    //   `AQI Level Changed to ${currentRange.toUpperCase()}`,
    //   AQI_RANGES[currentRange].message
    `AQI Level Changed: ${currentAQI} ${emoji}`,
    message
    );
    previousRange = currentRange;
  }
}

// Helper function to send notification
async function sendAQINotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Send immediately
  });
}

// Request notification permissions
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return;
  }

  return true;
}

// Get the push notification token (optional for remote notifications)
export async function getPushToken() {
  const projectId = Constants.expoConfig.extra.eas.projectId;
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}
