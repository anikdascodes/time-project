export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const padZero = (num: number): string => num.toString().padStart(2, '0');
  
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
};