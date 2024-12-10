import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearUserData } from './SessionStorage'; 
import { ThemeContext } from '../Components/ThemeContext';
import { LanguageContext } from '../Components/LanguageContext'; 
import { FontSizeContext } from '../Components/FontSizeProvider'; // Importe o contexto de tamanho da fonte

const Configuracoes = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, changeLanguage } = useContext(LanguageContext);
  const { fontSize, changeFontSize, getFontSize } = useContext(FontSizeContext); // Use o contexto de tamanho da fonte

  const handleSair = async () => {
    await clearUserData(); // Limpa os dados do usuário
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    Alert.alert('Logout', 'Você saiu com sucesso!');
  };

  return (
    <View style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>

      {/* Tema do aplicativo */}
      <View style={styles.fundoTitulo}>
        <Text style={[styles.opcaoTitulo, theme === 'escuro' ? styles.darkTextTitle : styles.lightTextTitle, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Tema do aplicativo:' : 'App Theme:'}
        </Text>
      </View>
      <View style={styles.opcaoContainer}>
        <TouchableOpacity onPress={() => toggleTheme('claro')} style={styles.radioContainer}>
          <View style={[styles.radioSelecionado, theme === 'claro' && styles.radioSelecionadoActive]} />
          <Text style={[styles.radioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Claro' : 'Light'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleTheme('escuro')} style={styles.radioContainer}>
          <View style={[styles.radioSelecionado, theme === 'escuro' && styles.radioSelecionadoActive]} />
          <Text style={[styles.radioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Escuro' : 'Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tamanho da fonte */}
      <View style={styles.fundoTitulo}>
        <Text style={[styles.opcaoTitulo, theme === 'escuro' ? styles.darkTextTitle : styles.lightTextTitle, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Tamanho da fonte:' : 'Font Size:'}
        </Text>
      </View>
      <View style={styles.opcaoContainer}>
        <TouchableOpacity onPress={() => changeFontSize('pequena')} style={styles.radioContainer}>
          <View style={[styles.radioSelecionado, fontSize === 'pequena' && styles.radioSelecionadoActive]} />
          <Text style={[styles.radioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Pequena' : 'Small'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeFontSize('medio')} style={styles.radioContainer}>
          <View style={[styles.radioSelecionado, fontSize === 'medio' && styles.radioSelecionadoActive]} />
          <Text style={[styles.radioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Média' : 'Medium'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeFontSize('grande')} style={styles.radioContainer}>
          <View style={[styles.radioSelecionado, fontSize === 'grande' && styles.radioSelecionadoActive]} />
          <Text style={[styles.radioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Grande' : 'Large'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Idioma do aplicativo */}
      <View style={styles.fundoTitulo}>
        <Text style={[styles.opcaoTitulo, theme === 'escuro' ? styles.darkTextTitle : styles.lightTextTitle, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Idioma do aplicativo:' : 'App Language:'}
        </Text>
      </View>
      <View style={styles.opcaoContainer}>
        <TouchableOpacity onPress={() => changeLanguage('pt')} style={styles.radioContainer}>
          <View style={[styles.radioSelecionado, language === 'pt' && styles.radioSelecionadoActive]} />
          <Text style={[styles.radioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Português' : 'Portuguese'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.radioContainer}>
          <View style={[styles.radioSelecionado, language === 'en' && styles.radioSelecionadoActive]} />
          <Text style={[styles.radioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Inglês' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Logout */}
      <View style={styles.sairContainer}>
        <TouchableOpacity onPress={handleSair} style={styles.botaoSair}>
          <Text style={[styles.textoSair, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Sair' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    padding: 20,
  },
  darkTheme: {
    backgroundColor: '#292929', // Fundo escuro para o tema escuro
  },
  lightTheme: {
    backgroundColor: '#e9e9e9', // Fundo claro para o tema claro
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff', // Texto claro para o tema escuro
  },
  lightText: {
    color: '#000', // Texto escuro para o tema claro
  },
  darkTextTitle:{
    color: '#000',
  },
  fundoTitulo: {
    backgroundColor: '#e0e0e0', // Cor de fundo leve (cinza claro)
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  opcaoTitulo: {
    fontSize: 18,
  },
  opcaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioTexto: {
    fontSize: 16,
    marginLeft: 10,
  },
  radioSelecionado: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff', // Cor da borda da bolinha
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Fundo transparente por padrão
  },
  radioSelecionadoActive: {
    backgroundColor: '#007bff', // Cor de fundo da bolinha quando selecionada
  },
  sairContainer: {
    marginTop: 'auto',
  },
  botaoSair: {
    backgroundColor: '#ff6400', // Cor de fundo do botão
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  textoSair: {
    color: '#fff', // Cor do texto
    fontSize: 16,
  },
});

export default Configuracoes;
