import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criação do Contexto
export const LanguageContext = createContext();

// Provedor do Contexto
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt'); // Valor padrão

  // Função para alterar o idioma e salvar no AsyncStorage
  const changeLanguage = async (selectedLanguage) => {
    try {
      console.log(`Salvando idioma: ${selectedLanguage}`); // Adiciona o log para depuração
      await AsyncStorage.setItem('language', selectedLanguage); // Salva no AsyncStorage
      setLanguage(selectedLanguage);
    } catch (error) {
      console.error('Erro ao salvar o idioma no AsyncStorage:', error);
    }
  };

  // Recupera o idioma salvo do AsyncStorage quando o aplicativo for iniciado
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        console.log(`Idioma carregado: ${savedLanguage}`); // Log para depuração
        if (savedLanguage) {
          setLanguage(savedLanguage); // Carrega o idioma salvo, caso exista
        }
      } catch (error) {
        console.error('Erro ao carregar o idioma do AsyncStorage:', error);
      }
    };

    loadLanguage();
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
