    // storage.js
    import AsyncStorage from '@react-native-async-storage/async-storage';

    const LAST_UPDATE_TIME_KEY = 'lastUpdateTime';

    export const getLastUpdateTime = async () => {
        try {
            const value = await AsyncStorage.getItem(LAST_UPDATE_TIME_KEY);
            if (value !== null) {
                return new Date(value); // Convert back to Date object
            }
            return null;
        } catch (e) {
            console.error("Error getting last update time", e);
            return null;
        }
    };

    export const setLastUpdateTime = async (timestamp) => {
        try {
            await AsyncStorage.setItem(LAST_UPDATE_TIME_KEY, timestamp.toDate().toISOString()); // Store as ISO string
        } catch (e) {
            console.error("Error setting last update time", e);
        }
    };
    