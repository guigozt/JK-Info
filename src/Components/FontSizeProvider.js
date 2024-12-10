        import React, { createContext, useState, useEffect } from 'react';
        import AsyncStorage from '@react-native-async-storage/async-storage';

        // Cria o contexto de tamanho da fonte
        export const FontSizeContext = createContext();

        export const FontSizeProvider = ({ children }) => {
        const [fontSize, setFontSize] = useState('medio'); // Tamanho de fonte padrão

        // Recuperar a preferência de tamanho de fonte do AsyncStorage quando o aplicativo iniciar
        useEffect(() => {
            const loadFontSize = async () => {
            try {
                const savedFontSize = await AsyncStorage.getItem('fontSize');
                if (savedFontSize) {
                setFontSize(savedFontSize);
                }
            } catch (error) {
                console.error('Erro ao carregar o tamanho da fonte:', error);
            }
            };

            loadFontSize();
        }, []);

        // Salvar o tamanho de fonte no AsyncStorage
        const saveFontSize = async (newFontSize) => {
            try {
            await AsyncStorage.setItem('fontSize', newFontSize);
            } catch (error) {
            console.error('Erro ao salvar o tamanho da fonte:', error);
            }
        };

        // Função para mudar o tamanho da fonte
        const changeFontSize = (newFontSize) => {
            setFontSize(newFontSize);
            saveFontSize(newFontSize);
        };

        // Função para retornar o valor numérico do tamanho da fonte com base na seleção
        const getFontSize = () => {
            switch (fontSize) {
            case 'pequena':
                return 12;
            case 'medio':
                return 16;
            case 'grande':
                return 20;
            default:
                return 16;
            }
        };

        return (
            <FontSizeContext.Provider value={{ fontSize, changeFontSize, getFontSize }}>
            {children}
            </FontSizeContext.Provider>
        );
        };
