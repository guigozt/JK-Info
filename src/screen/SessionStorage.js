// sessionStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para armazenar os dados do usuário
export const storeUserData = async (email, userType) => {
  try {
    await AsyncStorage.setItem('userEmail', email);
    await AsyncStorage.setItem('userType', userType);
  } catch (error) {
    console.error('Erro ao armazenar dados do usuário:', error);
  }
};

// Função para recuperar os dados do usuário
export const getUserData = async () => {
  try {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const userType = await AsyncStorage.getItem('userType');
    return { userEmail, userType };
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário:', error);
    return null;    
  }
};

// Função para remover os dados do usuário
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userType');
  } catch (error) {
    console.error('Erro ao limpar dados do usuário:', error);
  }
};
