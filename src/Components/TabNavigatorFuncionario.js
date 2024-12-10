import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreenFuncionario from '../screenFuncionario/HomeScreenFuncionario';
import ReclamacoesSugestFuncionario from '../screen/ReclamacoesSugest';
import Notificacoes from '../screen/Notificacoes';
import { ThemeContext } from '../Components/ThemeContext'; // Importa o ThemeContext
import { LanguageContext } from '../Components/LanguageContext'; // Importa o LanguageContext
import { FontSizeContext } from '../Components/FontSizeProvider'; // Importa o FontSizeContext
import Icon from 'react-native-vector-icons/Ionicons'; // Importa os ícones do Ionicons

const Tab = createBottomTabNavigator();

const TabNavigatorFuncionario = () => {
  const { theme } = useContext(ThemeContext); // Acessa o tema atual do contexto
  const { language } = useContext(LanguageContext); // Acessa o idioma do contexto
  const { getFontSize } = useContext(FontSizeContext); // Inclui o getFontSize

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === (language === 'pt' ? 'Home' : 'Home')) {
            iconName = 'home'; // Ícone para a tela Home
          } else if (route.name === (language === 'pt' ? 'Reclamações' : 'Complaints')) {
            iconName = 'chatbox-ellipses'; // Ícone para Reclamações/Sugestões
          } else if (route.name === (language === 'pt' ? 'Notificações' : 'Notifications')) {
            iconName = 'notifications'; // Ícone para Notificações
          }

          // Retorna o ícone com a cor e tamanho definidos
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00527C', // Cor azul para o texto e ícone da aba ativa
        tabBarInactiveTintColor: theme === 'escuro' ? '#888888' : 'gray', // Cor do texto da aba inativa
        tabBarStyle: {
          backgroundColor: theme === 'escuro' ? '#1c1c1c' : '#FFFFFF', // Fundo escuro no tema escuro, branco no claro
          borderTopWidth: 1,
          borderTopColor: theme === 'escuro' ? '#333' : '#ccc', // Cor da borda superior
        },
        tabBarLabelStyle: {
          fontSize: getFontSize(), // Aplica o tamanho da fonte dinamicamente
        },
        tabBarActiveBackgroundColor: theme === 'escuro' ? '#1c1c1c' : '#FFFFFF', // Fundo da aba ativa no tema escuro e claro
        headerShown: false, // Ocultar o cabeçalho em todas as telas do TabNavigator
      })}
    >
      <Tab.Screen 
        name={language === 'pt' ? 'Home' : 'Home'} 
        component={HomeScreenFuncionario} 
      />
      <Tab.Screen 
        name={language === 'pt' ? 'Reclamações' : 'Complaints'} 
        component={ReclamacoesSugestFuncionario} 
      />
      <Tab.Screen 
        name={language === 'pt' ? 'Notificações' : 'Notifications'} 
        component={Notificacoes} 
      />
    </Tab.Navigator>
  );
};
export default TabNavigatorFuncionario;
