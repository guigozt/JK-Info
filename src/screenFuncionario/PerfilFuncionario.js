import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native'; // Importando ScrollView
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { ThemeContext } from '../Components/ThemeContext'; // Importa o ThemeContext
import { FontSizeContext } from '../Components/FontSizeProvider'; // Importa o FontSizeContext
import { LanguageContext } from '../Components/LanguageContext'; // Importa o LanguageContext

const PerfilFuncionario = () => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [emailInstitucional, setEmailInstitucional] = useState('');
  const [emailPessoal, setEmailPessoal] = useState('');
  const [numeroCelular, setNumeroCelular] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');

  const { theme } = useContext(ThemeContext); // Acessa o tema atual do contexto
  const { fontSize, changeFontSize, getFontSize } = useContext(FontSizeContext); // Inclua getFontSize
  const { language } = useContext(LanguageContext); // Acessa o idioma do contexto

  // Função para buscar o perfil do usuário
  const fetchPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado');
        return;
      }

      const response = await axios.get('http://localhost:3000/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const perfil = response.data;
      setNome(perfil.nome);
      setDataNascimento(perfil.dataNascimento);
      setEmailInstitucional(perfil.emailInstitucional);
      setEmailPessoal(perfil.emailPessoal || '');
      setNumeroCelular(perfil.numeroCelular || '');
      setFotoPerfil(perfil.fotoPerfil || ''); // Foto de perfil ou padrão
    } catch (error) {
      console.error(`[ERRO] Falha ao carregar perfil: ${error}`);
      Alert.alert('Erro', 'Falha ao carregar informações do perfil');
    }
  };

  // Função para atualizar o perfil do usuário
  const atualizarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado');
        return;
      }

      await axios.put(
        'http://localhost:3000/perfil',
        { emailPessoal, numeroCelular, fotoPerfil },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(`[ERRO] Falha ao atualizar perfil: ${error}`);
      Alert.alert('Erro', 'Falha ao atualizar informações do perfil');
    }
  };

  // Função para selecionar imagem de perfil
  const selecionarImagem = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.errorCode) {
        console.error(`Erro ao selecionar imagem: ${response.errorMessage}`);
        Alert.alert('Erro', 'Não foi possível selecionar a imagem');
      } else {
        const uri = response.assets[0].uri;
        setFotoPerfil(uri); // Salva o caminho da imagem selecionada no estado
      }
    });
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
        {/* Exibindo imagem de perfil */}
        <TouchableOpacity style={styles.fotoContainer} onPress={selecionarImagem}>
          <Image
            source={{ uri: fotoPerfil || 'https://via.placeholder.com/150' }} // Foto padrão caso não exista
            style={styles.fotoPerfil}
          />
          <Text style={[styles.textoAlterarFoto, { fontSize }]}>
            {language === 'pt' ? 'Alterar foto de perfil' : 'Change profile picture'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.label, theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Nome:' : 'Name:'}
        </Text>
        <Text style={[styles.value, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>{nome}</Text>

        <Text style={[styles.label, theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Data de Nascimento:' : 'Date of Birth:'}
        </Text>
        <Text style={[styles.value, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>{dataNascimento}</Text>

        <Text style={[styles.label, theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Email Institucional:' : 'Institutional Email:'}
        </Text>
        <Text style={[styles.value, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>{emailInstitucional}</Text>

        <Text style={[styles.label, theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Email Pessoal:' : 'Personal Email:'}
        </Text>
        <TextInput
          style={[styles.input,
            theme === 'escuro' ? styles.darkTheme : styles.lightTheme, 
            theme === 'escuro' ? styles.darkText : styles.lightText,
            { fontSize: getFontSize() }]}
          value={emailPessoal}
          onChangeText={setEmailPessoal}
          placeholder={language === 'pt' ? 'Digite seu email pessoal' : 'Enter your personal email'}
        />

        <Text style={[styles.label, theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText, 
          { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Número de Celular:' : 'Phone Number:'}
        </Text>
        <TextInput
          style={[styles.input, 
            theme === 'escuro' ? styles.darkTheme : styles.lightTheme,
            theme === 'escuro' ? styles.darkText : styles.lightText,
            { fontSize: getFontSize() }]}
          value={numeroCelular}
          onChangeText={setNumeroCelular}
          placeholder={language === 'pt' ? 'Digite seu número de celular' : 'Enter your phone number'}
        />

        <TouchableOpacity
          style={[styles.botaoAtualizar,
            { fontSize: getFontSize() }]}
          onPress={atualizarPerfil}
        >
          <Text style={[styles.textoBotao,
            { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Atualizar Perfil' : 'Update Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1,paddingHorizontal: 20,},scrollContainer: {paddingBottom: 20,},darkTheme: {backgroundColor: '#292929',},lightTheme: {backgroundColor: '#f9f9f9',},darkText: {color: '#fff',},lightText: {color: '#000000',},darkTitleText: {color: '#000000',},lightTitleText: {color: '#000000',},label: {fontSize: 24,fontWeight: 'bold',marginBottom: 20,color: '#00527C',backgroundColor: '#e0e0e0',padding: 10,borderRadius: 5,marginBottom: 10,},value: {borderWidth: 1,borderColor: '#ccc',padding: 10,borderRadius: 5,backgroundColor: '#fff',marginBottom: 20,},input: {borderWidth: 1,borderColor: '#ccc',padding: 10,borderRadius: 5,backgroundColor: '#fff',marginBottom: 20,},fotoContainer: {alignItems: 'center',marginBottom: 20,},fotoPerfil: {width: 250,height: 250,borderRadius: 125,marginBottom: 20,borderWidth: 2,},textoAlterarFoto: {fontSize: 16,color: '#00527C',},botaoAtualizar: {paddingVertical: 10,paddingHorizontal: 20,alignItems: 'center',marginTop: 7,width: '100%',height: 50,backgroundColor: '#ff6400',borderRadius: 20,justifyContent: 'center',marginBottom: 10,},textoBotao: {color: '#ffff',}
});

export default PerfilFuncionario;
