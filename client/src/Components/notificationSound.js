let audio;

export const playNotificationSound = () => {
  if (!audio) {
    audio = new Audio("/notification.mp3");
  }
  audio.currentTime = 0;
  audio.play().catch(() => {});
};
