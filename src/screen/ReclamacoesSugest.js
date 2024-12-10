import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SwipeGestures from 'react-native-swipe-gestures';
import { ThemeContext } from '../Components/ThemeContext';
import { FontSizeContext } from '../Components/FontSizeProvider'; // Import FontSizeContext
import { LanguageContext } from '../Components/LanguageContext'; // Import LanguageContext

const ReclamacoesSugest = () => {
  const navigation = useNavigation();
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mensagemEnviada, setMensagemEnviada] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const { theme } = useContext(ThemeContext); // Acessa o tema atual do contexto
  const { fontSize, getFontSize } = useContext(FontSizeContext); // Get FontSize
  const { language } = useContext(LanguageContext); // Acessa o idioma do contexto

  const Pessoa_idPessoa = 1; // Exemplo de ID de usuário autenticado

  const EnviarReclamacoesouSugestoes = async () => {
    if (!assunto || !mensagem) {
      setMensagemErro(language === 'pt' ? 'Por favor, preencha todos os campos.' : 'Please fill out all fields.');
      setTimeout(() => setMensagemErro(''), 5000);
      return;
    }

    const dados = {
      assunto,
      mensagem,
      Pessoa_idPessoa,
    };

    try {
      const response = await fetch('http://localhost:3000/reclamacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      const result = await response.json();

      if (response.status === 200) {
        setMensagemEnviada(true);
        setAssunto('');
        setMensagem('');
        setMensagemErro('');
        setTimeout(() => setMensagemEnviada(false), 5000);
      } else {
        setMensagemErro(result.message || (language === 'pt' ? 'Erro ao enviar reclamação.' : 'Error sending complaint.'));
      }
    } catch (error) {
      console.error('Erro ao enviar reclamação:', error);
      setMensagemErro(language === 'pt' ? 'Erro ao enviar reclamação.' : 'Error sending complaint.');
    }
  };

  const onSwipeLeft = () => navigation.navigate('Home');

  return (
    <SwipeGestures
      onSwipeLeft={onSwipeLeft}
      config={{ velocityThreshold: 0.1, directionalOffsetThreshold: 80 }}
      style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}
    >
      <View style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
        <TextInput
          style={[
            styles.inputAssunto,
            theme === 'escuro' ? styles.darkTheme : styles.lightTheme,
            theme === 'escuro' ? styles.darkText : styles.lightText,
            { fontSize: getFontSize() },
          ]}
          placeholder={language === 'pt' ? 'Assunto' : 'Subject'}
          value={assunto}
          onChangeText={setAssunto}
        />

        <ScrollView
          style={[styles.inputMensagemContainer, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}
          contentContainerStyle={styles.inputMensagemContentContainer}
        >
          <TextInput
            style={[
              styles.inputMensagem,
              theme === 'escuro' ? styles.darkTheme : styles.lightTheme,
              theme === 'escuro' ? styles.darkText : styles.lightText,
              { fontSize: getFontSize() },
            ]}
            multiline
            placeholder={language === 'pt' ? 'Descreva sua reclamação ou sugestão' : 'Describe your complaint or suggestion'}
            value={mensagem}
            onChangeText={setMensagem}
          />
        </ScrollView>

        <TouchableOpacity onPress={EnviarReclamacoesouSugestoes} style={styles.sendButton}>
          <Text style={[styles.sendButtonText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Enviar' : 'Send'}
          </Text>
        </TouchableOpacity>

        {mensagemErro && (
          <Text style={[styles.mensagemErro, { fontSize: getFontSize() }]}>{mensagemErro}</Text>
        )}
        {mensagemEnviada && (
          <Text style={[styles.mensagemEnviada, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Mensagem enviada com sucesso!' : 'Message sent successfully!'}
          </Text>
        )}
      </View>
    </SwipeGestures>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  darkTheme: {
    backgroundColor: '#292929',
  },
  lightTheme: {
    backgroundColor: '#f9f9f9',
  },darkText: {color: '#fff',},lightText: {color: '#000000',},darkTitleText: {color: '#000000',},lightTitleText: {color: '#000000'},
  inputAssunto: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    padding: 10,
    marginVertical: 10,
  },
  inputMensagemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 18,
    width: '100%',
    maxHeight: 300,
    marginBottom: 10,
  },
  inputMensagemContentContainer: {
    flexGrow: 1,
  },
  inputMensagem: {
    flex: 1,
    padding: 10,
  },
  sendButton: {
    width: '30%',
    backgroundColor: '#ff6400',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  mensagemErro: {
    color: 'red',
    marginTop: 10,
  },
  mensagemEnviada: {
    color: 'green',
    marginTop: 10,
  },
});

export default ReclamacoesSugest;
