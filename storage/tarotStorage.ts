import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_READING_KEY = 'CURRENT_TAROT_READING';

export const saveCurrentReading = async (reading: TarotReading) => {
  try {
    await AsyncStorage.setItem(
      CURRENT_READING_KEY,
      JSON.stringify(reading)
    );
  } catch (e) {
    console.log('Save error', e);
  }
};

type TarotReading = {
  id: string;
  cards: string[];
  interpretation: string;
  createdAt: number;
};

export const getCurrentReading = async () => {
  try {
    const data = await AsyncStorage.getItem(CURRENT_READING_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log('Read error', e);
    return null;
  }
};

export const clearCurrentReading = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_READING_KEY);
  } catch (e) {
    console.log('Clear error', e);
  }
};