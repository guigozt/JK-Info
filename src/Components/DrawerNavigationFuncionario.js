import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigatorFuncionario from './TabNavigatorFuncionario';
import PublicacoesFuncionario from '../screenFuncionario/PublicacoesFuncionario';
import RedeFuncionario from '../screenFuncionario/RedeFuncionario';
import Sobrenos from '../screen/Sobrenos';
import Configuracoes from '../screen/Configuracoes';
import PerfilFuncionario from '../screenFuncionario/PerfilFuncionario';
import NotasFuncionario from '../screenFuncionario/NotasFuncionario';
import CustomDrawerContent from './CustomDrawerContent';
import { LanguageContext } from '../Components/LanguageContext'; // Importa o contexto de idioma
import { FontSizeContext } from './FontSizeProvider'; // Importa o contexto de tamanho de fonte

const Drawer = createDrawerNavigator();

const DrawerNavigatorFuncionario = () => {
  const { language } = useContext(LanguageContext); // Acessa o idioma do contexto
  const { fontSize, getFontSize } = useContext(FontSizeContext); // Inclui o getFontSize

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#FFFFFF',  // Cor do texto quando a aba está ativa
        drawerInactiveTintColor: '#d3d3d3',  // Cor do texto quando a aba está inativa
        drawerStyle: {
          backgroundColor: '#00527C',  // Cor de fundo do drawer
        },
        drawerLabelStyle: {
          fontSize: getFontSize(), // Aplica o tamanho dinâmico da fonte ao rótulo do drawer
        },
        headerStyle: {
          backgroundColor: '#00527C',  // Cor do fundo do cabeçalho
        },
        headerTintColor: '#FFFFFF',  // Cor do texto do cabeçalho
        headerTitleStyle: {
          fontSize: getFontSize(), // Aplica o tamanho dinâmico da fonte ao título do cabeçalho
        }
      }}
    >
      <Drawer.Screen 
        name={language === 'pt' ? 'Home' : 'Home'} 
        component={TabNavigatorFuncionario}
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Minhas Publicações' : 'My Posts'} 
        component={PublicacoesFuncionario} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Perfil' : 'Profile'} 
        component={PerfilFuncionario} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Rede' : 'Network'} 
        component={RedeFuncionario} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Notas' : 'Grades'} 
        component={NotasFuncionario} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Sobre nós' : 'About Us'} 
        component={Sobrenos} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Configurações' : 'Settings'} 
        component={Configuracoes} 
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorFuncionario;
