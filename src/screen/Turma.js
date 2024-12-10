import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../Components/ThemeContext'; // Importa o ThemeContext
import { FontSizeContext } from '../Components/FontSizeProvider'; // Importa o FontSizeContext
import { LanguageContext } from '../Components/LanguageContext'; // Importa o LanguageContext

const TurmaScreen = () => {
  const [notas, setNotas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [token, setToken] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [rmAluno, setRmAluno] = useState('');

  const { theme } = useContext(ThemeContext); // Acessa o tema atual do contexto
  const { getFontSize, changeFontSize } = useContext(FontSizeContext);
  const { language } = useContext(LanguageContext); // Acessa o idioma do contexto

  // Função para obter o token de autenticação
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      setToken(token);
    } catch (error) {
      console.error('Erro ao obter o token', error);
    }
  };

  // Carregar o token e os dados quando o componente for montado
  useEffect(() => {
    getToken();
  }, []);

  const fetchAlunoLogado = async () => {
    try {
      const alunoResponse = await fetch('http://localhost:3000/perfil', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const alunoData = await alunoResponse.json();
      if (alunoData) {
        setNomeAluno(alunoData.nomeAluno);
        setRmAluno(alunoData.rmAluno);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do aluno:', error);
    }
  };

  // Função para buscar os dados (alunos, professores e notas)
  const fetchData = async () => {
    try {
      const alunosResponse = await fetch('http://localhost:3000/alunosTurma', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const professoresResponse = await fetch('http://localhost:3000/professoresTurma', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const notasResponse = await fetch('http://localhost:3000/notasTurma', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const alunosData = await alunosResponse.json();
      console.log("Alunos da Turma Recebidos: ", alunosData);

      const professoresData = await professoresResponse.json();
      console.log("Professores Recebidos: ", professoresData);

      const notasData = await notasResponse.json();
      console.log("Notas recebidas: ", notasData);

      setAlunos(alunosData);
      setProfessores(professoresData);
      setNotas(notasData);
    } catch (error) {
      console.error('Erro ao buscar dados da turma:', error);
    }
  };

  // Carregar os dados quando o token for atualizado
  useEffect(() => {
    if (token) {
      fetchData();
      fetchAlunoLogado();
    }
  }, [token]);

  const renderNotaItem = ({ item }) => (
    <TextInput
      style={[styles.notaInput, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}
      value={item.nota ? item.nota.toString() : 'N/A'}
      multiline={true}
      editable={false}
    />
  );

  const renderAlunoItem = ({ item }) => (
    <View style={styles.alunoItem } >
      <Text style={[styles.alunoText, { fontSize: getFontSize() }]}>{item.NomeAluno}</Text>
    </View>
  );

  const renderProfessorItem = ({ item }) => (
    <View style={styles.professorItem }>
      <Text style={[styles.professorText, { fontSize: getFontSize() }]}>{item.NomeProfessor}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
      <View style={styles.perfil}>
        <View style={styles.avatar}></View>
        <View>
          <Text style={[styles.alunoNome, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>
            {nomeAluno || (language === 'pt' ? 'Nome do aluno' : 'Student Name')}
          </Text>
          <Text style={[styles.alunoRM, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>
            {rmAluno || 'RM'}</Text>
        </View>
      </View>

      <View style={[styles.notasSection, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
        <Text style={[styles.notasHeader, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Lembretes' : 'Reminders'}
        </Text>
        <FlatList
          data={notas}
          renderItem={renderNotaItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={[styles.listasEmailSection, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
        <View style={[styles.rowContainer, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>
          <View style={[styles.alunosSection, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
            <Text style={[styles.sectionHeader, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>
              {language === 'pt' ? 'Alunos da Turma' : 'Classmates'}
            </Text>
            <FlatList
              data={alunos}
              renderItem={renderAlunoItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              style={[styles.flatList, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}
              contentContainerStyle={[styles.flatListContent, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}
            />
          </View>

          <View style={[styles.professoresSection, , theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
            <Text style={[styles.sectionHeader, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}>
              {language === 'pt' ? 'Professores da Turma' : 'Teachers'}
            </Text>
            <FlatList
              data={professores}
              renderItem={renderProfessorItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              style={[styles.flatList, theme === 'escuro' ? styles.darkText : styles.lightText, theme === 'escuro' ? styles.darkTheme : styles.lightTheme, { fontSize: getFontSize() }]}
              contentContainerStyle={[styles.flatListContent, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkTheme: {
    backgroundColor: '#292929',
  },
  lightTheme: {
    backgroundColor: '#f9f9f9',
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000000',
  },
  darkTitleText: {
    color: '#fff',
  },
  lightTitleText: {
    color: '#000000',
  },
  alunoText:{
    color: '#000',
  },
  professorText:{
    color: '#000',
  },
  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alunoRM: {
    fontSize: 14,
    color: '#555',
  },
  notasSection: {
    padding: 10,
  },
  notasHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notaInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  alunosSection: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#dddddd',
    maxHeight: 400,
    marginTop: 5,
  },
  professoresSection: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#dddddd',
    maxHeight: 400,
    marginTop: 5,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center",
  },
  alunoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    borderColor: "#dddddd",
    borderWidth: 1,
  },
  professorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    borderColor: "#dddddd",
    borderWidth: 1,
  },
  listasEmailSection: {
    paddingVertical: 10,
  },
  flatList: {
    flexGrow: 1,
  },
  flatListContent: {
    paddingBottom: 10,
  },
});

export default TurmaScreen;
