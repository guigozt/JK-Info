import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigatorProfessor from './TabNavigationProfessor';
import PerfilProfessor from '../screenProfessor/PerfilProfessor';
import RedeProfessor from '../screenProfessor/RedeProfessor';
import NotasProfessor from '../screenProfessor/NotasProfessor';
import Sobrenos from '../screen/Sobrenos';
import Configuracoes from '../screen/Configuracoes';
import CustomDrawerContent from './CustomDrawerContent';
import PublicacoesProfessor from '../screenProfessor/PublicacoesProfessor';
import { LanguageContext } from '../Components/LanguageContext'; // Importa o contexto de idioma
import { FontSizeContext } from './FontSizeProvider'; // Importa o contexto de tamanho de fonte

const Drawer = createDrawerNavigator();

const DrawerNavigatorProfessor = () => {
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
        component={TabNavigatorProfessor}
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Minhas Publicações' : 'My Posts'} 
        component={PublicacoesProfessor} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Perfil' : 'Profile'} 
        component={PerfilProfessor} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Rede' : 'Network'} 
        component={RedeProfessor} 
      />
      <Drawer.Screen 
        name={language === 'pt' ? 'Notas' : 'Grades'} 
        component={NotasProfessor} 
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

export default DrawerNavigatorProfessor;
