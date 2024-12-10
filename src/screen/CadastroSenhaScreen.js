import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';

const CadastroSenhaScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSetPassword = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail e defina uma senha.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/set-password', { email, senha });
      if (response.data.success) {
        Alert.alert('Sucesso', 'Senha definida com sucesso! Agora você pode fazer login.');
        navigation.navigate('Login'); // Redireciona para a tela de login
      } else {
        Alert.alert('Erro', response.data.message || 'Não foi possível definir a senha.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao definir a senha.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={text => setSenha(text)}
        placeholder="Defina sua senha"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleSetPassword}>
        <Text style={styles.buttonText}>Definir Senha</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#00527C',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: '#000',
  },
  button: {
    alignItems: 'center',
    width: '90%',
    height: 50,
    backgroundColor: '#ff6400',
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CadastroSenhaScreen;
