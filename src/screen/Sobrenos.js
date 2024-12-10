import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ThemeContext } from '../Components/ThemeContext'; // Importe o ThemeContext
import { LanguageContext } from '../Components/LanguageContext'; // Importe o LanguageContext
import { FontSizeContext } from '../Components/FontSizeProvider'; // Importe o contexto de tamanho da fonte

import fotoGuilherme from '../../assets/FotosSobrenos/Guilherme-gomes.jpeg';
import fotoLucas from '../../assets/FotosPerfil/Foto-perfil-Anonima.jpg';
import fotoPablo from '../../assets/FotosSobrenos/Pablo-henrique.jpeg';
import fotoCaique from '../../assets/FotosSobrenos/Caique-tavares.jpeg';

const membrosDaEquipe = [
  {
    nome: 'Guilherme Gomes da Silva',
    funcao: {
      pt: 'Desenvolvedor Full-Stack - Responsável por todo o layout e as interfaces de usuário, garantindo uma experiência intuitiva e responsiva. Implementei partes das funcionalidades do aplicativo, integrando-o com o banco de dados, o que permitiu a comunicação eficiente entre a aplicação e as informações armazenadas.',
      en: 'Full-Stack Developer - Responsible for the entire layout and user interfaces, ensuring an intuitive and responsive experience. I implemented parts of the application’s functionalities, integrating it with the database, enabling efficient communication between the application and the stored information.',
    },
    contatos: [
      { plataforma: 'Github', link: 'https://github.com/guigomes2616' },
      { plataforma: 'Linkedin', link: 'https://linkedin.com/in/guigomes2616' },
      { plataforma: 'Instagram', link: 'https://instagram.com/guigozt' }
    ],
    foto: fotoGuilherme,
  },
  {
    nome: 'Lucas Malone',
    funcao: {
      pt: 'Desenvolvedor - Responsável pela criação e organização das apresentações do TCC, estruturando o roteiro e os slides para garantir uma comunicação clara e eficiente dos conceitos. Além disso, ofereci suporte ao desenvolvimento, auxiliando na implementação de funcionalidades e na resolução de problemas técnicos, contribuindo para o alinhamento entre o desenvolvimento e as apresentações.',
      en: 'Developer - Responsible for creating and organizing the TCC presentations, structuring the script and slides to ensure clear and effective communication of the concepts. Additionally, I supported development by assisting in the implementation of features and resolving technical issues, contributing to the alignment between development and presentations.',
    },
    contatos: [
      { plataforma: 'Github', link: 'https://github.com/LucasMalone' },
      { plataforma: 'Instagram', link: 'https://instagram.com/malonekastel' },
    ],
    foto: fotoLucas,
  },
  {
    nome: 'Pablo Henrique',
    funcao: {
      pt: 'Desenvolvedor Back-End - Responsável pela camada de dados de um aplicativo em React Native, focando no back-end e na integração com o banco de dados. Projetei e gerenciei o banco de dados, criei APIs eficientes para comunicação entre o app e o servidor, e implementei soluções para garantir a integridade e sincronização dos dados, otimizando a experiência do usuário.',
      en: 'Back-End Developer - Responsible for the data layer of a React Native application, focusing on back-end and database integration. I designed and managed the database, created efficient APIs for communication between the app and the server, and implemented solutions to ensure data integrity and synchronization, optimizing the user experience.',
    },
    contatos: [
      { plataforma: 'Github', link: 'https://github.com/PabloHenrique1533' },
      { plataforma: 'Instagram', link: 'https://instagram.com/_phenrique.03' },
    ],
    foto: fotoPablo,
  },
  {
    nome: 'Caique Rocha',
    funcao: {
      pt: 'Desenvolvedor - Responsável pelo desenvolvimento da parte escrita do TCC, organizando e redigindo capítulos importantes, como a fundamentação teórica e metodológica. Além disso, ofereci suporte às demandas do código, auxiliando na documentação técnica e na solução de problemas.',
      en: 'Developer - Responsible for writing the TCC, organizing and drafting important chapters such as theoretical and methodological foundations. Additionally, I supported code demands by assisting with technical documentation and solving issues.',
    },
    contatos: [
      { plataforma: 'Github', link: 'https://github.com/c9iqueee' },
      { plataforma: 'Instagram', link: 'https://instagram.com/kkjcaique' },
    ],
    foto: fotoCaique,
  }
];

const Sobrenos = () => {
  const { language } = useContext(LanguageContext); // Acesse o idioma
  const { theme } = useContext(ThemeContext); // Acesse o tema
  const { fontSize, changeFontSize, getFontSize } = useContext(FontSizeContext); // Use o contexto de tamanho da fonte

  // Defina os estilos dinâmicos com base no tema e tamanho da fonte
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === 'escuro' ? '#292929' : '#f9f9f9', // Altere o fundo conforme o tema
    },
    containerMembro: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: theme === 'escuro' ? '#444' : '#ffffff', // Fundo do membro
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center', // Alinha os itens ao centro
    },
    foto: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center', // Centraliza verticalmente
    },
    nome: {
      fontSize: getFontSize(), // Aplica o tamanho de fonte dinâmico
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme === 'escuro' ? '#fff' : '#333', // Cor do nome
    },
    funcao: {
      fontSize: getFontSize(), // Aplica o tamanho de fonte dinâmico
      marginBottom: 5,
      color: theme === 'escuro' ? '#bbb' : '#555', // Cor da função
    },
    contato: {
      fontSize: getFontSize(), // Aplica o tamanho de fonte dinâmico
      marginVertical: 2,
      color: theme === 'escuro' ? '#bbb' : '#555', // Cor dos contatos
    },
    plataformaContato: {
      fontWeight: 'bold',
    },
    linkContato: {
      color: 'blue',
      textDecorationLine: 'underline', // Adiciona um sublinhado aos links
    },
  });

  return (
    <ScrollView style={styles.container}>
      {membrosDaEquipe.map((membro, index) => (
        <View key={index} style={styles.containerMembro}>
          <Image source={membro.foto} style={styles.foto} />
          <View style={styles.textContainer}>
            <Text style={styles.nome}>{membro.nome}</Text>
            <Text style={styles.funcao}>{membro.funcao[language]}</Text> {/* Exibe a função no idioma correto */}
            {membro.contatos.map((contato, index) => (
              <TouchableOpacity key={index} onPress={() => Linking.openURL(contato.link)}>
                <Text style={styles.contato}>
                  <Text style={styles.plataformaContato}>{contato.plataforma}: </Text>
                  <Text style={styles.linkContato}>{contato.link}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Sobrenos;
