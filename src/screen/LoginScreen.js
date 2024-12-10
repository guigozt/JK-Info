import axios from 'axios';
import React, { useState, useEffect, useId } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const userType = await AsyncStorage.getItem('userType');
        switch (userType) {
          case 'aluno':
            navigation.navigate('DrawerNavigatorAluno');
            break;
          case 'professor':
            navigation.navigate('DrawerNavigatorProfessor');
            break;
          case 'funcionario':
            navigation.navigate('DrawerNavigatorFuncionario');
            break;
          case 'gestao':
            navigation.navigate('DrawerNavigatorGestao');
            break;
          default:
            Alert.alert('Erro', 'Tipo de usuário inválido.');
            break;
        }
      }
    };
    checkLoggedIn();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail e senha.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:3000/login', { email, senha });
  
      if (response.data.success) {
        const { token, userType, userName, userEmailInstitucional, userEmailPessoal } = response.data;
  
        // Armazenar o token e as informações do usuário
        await AsyncStorage.setItem('jwtToken', token); // Armazena o token como jwtToken
        await AsyncStorage.setItem('userType', userType);
        await AsyncStorage.setItem('userName', userName);
        await AsyncStorage.setItem('userEmailInstitucional', userEmailInstitucional);
        await AsyncStorage.setItem('userEmailPessoal', userEmailPessoal);
  
        // Navegar para a tela inicial do usuário
        switch (userType) {
          case 'aluno':
            navigation.navigate('DrawerNavigatorAluno');
            break;
          case 'professor':
            navigation.navigate('DrawerNavigatorProfessor');
            break;
          case 'funcionario':
            navigation.navigate('DrawerNavigatorFuncionario');
            break;
          case 'gestao':
            navigation.navigate('DrawerNavigatorGestao');
            break;
          default:
            Alert.alert('Erro', 'Tipo de usuário inválido.');
            break;
        }
      } else {
        Alert.alert('Erro', response.data.message || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Login failed: ', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#00527C" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.j}>J</Text>
        <Text style={styles.k}>K</Text>
        <Text style={styles.info}>Info</Text>
      </View>

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
        placeholder="Digite sua senha"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão para cadastrar senha */}
      <TouchableOpacity onPress={() => navigation.navigate('CadastroSenhaScreen')}>
        <Text style={styles.linkText}>Não tem senha? Cadastre agora</Text>
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
  header: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  j: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#00527C',
  },
  k: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ff6400',
  },
  info: {
    fontSize: 50,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#00527C',
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
    backgroundColor: '#00527C',
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  linkText: {
    color: '#00527C',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
