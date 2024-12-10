import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/LoginScreen';
import CadastroSenhaScreen from './src/screen/CadastroSenhaScreen.js';
import DrawerNavigatorAluno from './src/Components/DrawerNavigation'; // Navegador de Alunos
import DrawerNavigatorProfessor from './src/Components/DrawerNavigationProfessor'; // Navegador de Professores
import TabNavigatorAluno from './src/Components/TabNavigationAluno.js'; // Navegador de Abas de Alunos
import TabNavigatorProfessor from './src/Components/TabNavigationProfessor'; // Navegador de Abas de Professores
import TabNavigatorGestao from './src/Components/TabNavigatorGestor.js';
import DrawerNavigatorGestor from './src/Components/DrawerNavigationGestao.js';
import DrawerNavigatorFuncionario from './src/Components/DrawerNavigationFuncionario.js';
import TabNavigatorFuncionario from './src/Components/TabNavigatorFuncionario.js';
import { LanguageProvider, LanguageContext } from './src/Components/LanguageContext.js';
import axios from 'axios';
import { JWT_SECRET_KEY } from '@env';
import {ThemeProvider, ThemeContext} from './src/Components/ThemeContext.js';
import { FontSizeProvider } from './src/Components/FontSizeProvider.js';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log(JWT_SECRET_KEY);  // Isso vai imprimir a chave do JWT
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000')
      .then(response => {
        setAlunos(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar alunos:', error);
      });
  }, []);

  return (
    <FontSizeProvider>
    <LanguageProvider>
    <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastroSenhaScreen"
          component={CadastroSenhaScreen} // Certifique-se de que a tela de cadastro está definida aqui
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen
          name="DrawerNavigatorAluno"
          component={DrawerNavigatorAluno}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrawerNavigatorProfessor"
          component={DrawerNavigatorProfessor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabNavigatorAluno"
          component={TabNavigatorAluno}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabNavigatorProfessor"
          component={TabNavigatorProfessor}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TabNavigatorGestao"
          component={TabNavigatorGestao}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DrawerNavigatorGestao"
          component={DrawerNavigatorGestor}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TabNavigatorFuncionario"
          component={TabNavigatorFuncionario}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DrawerNavigatorFuncionario"
          component={DrawerNavigatorFuncionario}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
    </LanguageProvider>
    </FontSizeProvider>
  );
}
