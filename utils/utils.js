import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const base64Decode = (input) => {
  try {
    return Buffer.from(input, 'base64').toString('utf-8');
  } catch (e) {
    console.error('Failed to decode base64 string', e);
    return '';
  }
};

export const getDomain = (url) => {
  try {
    let result = url.replace(/(https?:\/\/)?(www\d?\.)?/, '').split('/')[0];
    return result;
  } catch (error) {
    console.error("Failed to get domain from URL:", error);
    return url;
  }
};

export const checkFirstLaunch = async () => {
  try {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if (!hasLaunched) {
      await AsyncStorage.setItem('hasLaunched', 'true');
      return true; // first launch
    }
    return false; // not first launch
  } catch (error) {
    console.error("Failed to check first launch:", error);
    return false;
  }
};
