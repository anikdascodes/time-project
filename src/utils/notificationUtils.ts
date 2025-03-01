export const playNotificationSound = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-2573.mp3');
    audio.play();
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export const showNotification = async (title: string, options?: NotificationOptions) => {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    return new Notification(title, options);
  }
  
  return null;
};