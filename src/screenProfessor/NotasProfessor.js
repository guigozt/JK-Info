import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ThemeContext } from '../Components/ThemeContext';
import { FontSizeContext } from '../Components/FontSizeProvider';
import { LanguageContext } from '../Components/LanguageContext';

const NotasProfessor = () => {
  const [notas, setNotas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [nota, setNota] = useState('');
  const [turmas, setTurmas] = useState([]);
  const [editando, setEditando] = useState(false);
  const [notaEditar, setNotaEditar] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const { theme } = useContext(ThemeContext); // Acessando o valor do tema
  const { getFontSize } = useContext(FontSizeContext); // Acessando o tamanho da fonte
  const { language } = useContext(LanguageContext); // Acessando o idioma

  useEffect(() => {
    console.log('Carregando turmas e notas...');
    Promise.all([
      fetch('http://localhost:3000/turmas')
        .then((response) => response.json())
        .then((data) => {
          console.log('Turmas:', data);
          setTurmas(data);
        })
        .catch((error) => console.error('Erro ao carregar turmas:', error)),

      fetch('http://localhost:3000/notas')
        .then((response) => response.json())
        .then((data) => {
          console.log('Notas:', data);
          setNotas(data);
        })
        .catch((error) => console.error('Erro ao carregar notas:', error)),
    ]).finally(() => setIsLoading(false));
  }, []);

  const handleSendNota = () => {
    if (!turmaSelecionada) {
      alert('Por favor, selecione uma turma.');
      return;
    }

    fetch('http://localhost:3000/notas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nota, turmaId: turmaSelecionada }), // Enviando o ID da turma
    })
      .then((response) => response.json())
      .then((data) => {
        setNotas((prevNotas) => [...prevNotas, data]);
        setNota('');
      })
      .catch((error) => console.error('Erro ao criar nota:', error));
  };

  const handleEditNota = (item) => {
    fetch(`http://localhost:3000/notas/${item.idNota}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nota, turmaId: turmaSelecionada }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNotas((prevNotas) =>
          prevNotas.map((n) => (n.idNota === item.idNota ? data : n))
        );
        setNota('');
        setNotaEditar({});
        setEditando(false);
      })
      .catch((error) => console.error('Erro ao editar nota:', error));
  };

  const handleDeleteNota = (item) => {
    fetch(`http://localhost:3000/notas/${item.idNota}`, {
      method: 'DELETE',
    })
      .then(() => {
        setNotas((prevNotas) => prevNotas.filter((n) => n.idNota !== item.idNota));
      })
      .catch((error) => console.error('Erro ao excluir nota:', error));
  };

  const handleSelectTurma = (turmaId) => {
    setTurmaSelecionada(turmaId); // Definindo o ID da turma
    setModalVisible(false); // Fechando o modal após a seleção
  };

  if (isLoading) {
    return <Text>Carregando Dados...</Text>;
  }

  return (
    <View style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
      <Text style={[styles.label, theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText, { fontSize: getFontSize() }]}>
        {language === 'pt' ? 'Selecione a Turma:' : 'Select the Class:'}
      </Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={[styles.pickerButtonText, { fontSize: getFontSize() }]}>
          {turmaSelecionada ? `${language === 'pt' ? 'Turma Selecionada:' : 'Selected Class:'} ${turmaSelecionada}` : (language === 'pt' ? 'Selecione a turma' : 'Select class')}
        </Text>
      </TouchableOpacity>

      {/* Modal para selecionar turma */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
            <Text style={[styles.modalTitle, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
              {language === 'pt' ? 'Selecionar Turma' : 'Select Class'}
            </Text>
            <ScrollView style={[styles.turmaScroll, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
              <TouchableOpacity
                style={[styles.turmaButton, { fontSize: getFontSize() }]}
                onPress={() => handleSelectTurma('Todas')}
              >
                <Text style={[styles.textoTurma, { fontSize: getFontSize() }]}>{language === 'pt' ? 'Todas as Turmas' : 'All Classes'}</Text>
              </TouchableOpacity>
              {turmas.map((turma) => (
                <TouchableOpacity
                  key={turma.idTurma}
                  style={styles.turmaButton}
                  onPress={() => handleSelectTurma(turma.nomeTurma)}
                >
                  <Text style={[styles.textoTurma, { fontSize: getFontSize() }]}>{turma.nomeTurma}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisible(false)}>
              <Text style={[styles.textoBotaoFecharModal, { fontSize: getFontSize() }]}>
                {language === 'pt' ? 'Fechar' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={[
          styles.inputAviso,
          theme === 'escuro' ? styles.darkTheme : styles.lightTheme,
          theme === 'escuro' ? styles.darkText : styles.lightText,
          { fontSize: getFontSize() }
        ]}
        placeholder={language === 'pt' ? 'Digite o Aviso' : 'Enter the Notice'}
        value={nota}
        onChangeText={(text) => setNota(text)}
        keyboardType="default"
      />

      {editando ? (
        <TouchableOpacity style={styles.buttonEnviarAviso} onPress={() => handleEditNota(notaEditar)}>
          <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Salvar Edição' : 'Save Edit'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonEnviarAviso} onPress={handleSendNota}>
          <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
            {language === 'pt' ? 'Adicionar Aviso' : 'Add Notice'}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.subtitle, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
        {language === 'pt' ? 'Lembretes Enviados:' : 'Sent Notices:'}
      </Text>

      <FlatList
        data={notas && notas.length > 0 ? notas : []}
        renderItem={({ item }) => (
          <View style={styles.notaContainer}>
            <Text style={[styles.nota, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
              {`${language === 'pt' ? 'Lembretes' : 'Notices'}: ${item.nota} - ${language === 'pt' ? 'Turma' : 'Class'} ${item.Turma_idTurma}`}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.buttonEnviar, { fontSize: getFontSize() }]}
                onPress={() => {
                  setEditando(true);
                  setNotaEditar(item);
                  setNota(item.nota);
                  setTurmaSelecionada(item.Turma_idTurma);
                }}
              >
                <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
                  {language === 'pt' ? 'Editar' : 'Edit'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonExcluir}
                onPress={() => handleDeleteNota(item)}
              >
                <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
                  {language === 'pt' ? 'Excluir' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.idNota.toString()}
      />
    </View>
  );
};

  const styles = StyleSheet.create({
  container: {flex: 1,padding: 20,backgroundColor: '#f9f9f9',},darkTheme: {backgroundColor: '#292929',},lightTheme: {backgroundColor: '#f9f9f9',},titulo: {fontSize: 24,fontWeight: 'bold',marginBottom: 20,},darkText: {color: '#FFFFFF',},darkTitleText: {color: '#FFFFFF',},lightText: {color: '#000000',},lightTitleText: {color: '#000000',},label: {fontSize: 22,fontWeight: '700',marginBottom: 15,},pickerButton: {backgroundColor: '#ff6400',padding: 15,borderRadius: 10,marginBottom: 20,alignItems: 'center',},pickerButtonText: {fontSize: 16,color: '#FFF',},modalContainer: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0,0,0,0.5)',},modalContent: {width: '85%',height: '80%',backgroundColor: '#dddddd',borderRadius: 10,padding: 20,alignItems: 'center',},modalTitle: {fontSize: 20,fontWeight: '700',marginBottom: 15,},turmaScroll: {maxHeight: 300,width: '100%',},turmaButton: {padding: 12,marginVertical: 5,backgroundColor: '#f0f0f0',borderRadius: 5,width: '100%',alignItems: 'center',},textoTurma: {fontSize: 16,color: '#333',},inputAviso: {borderWidth: 1,borderColor: '#ccc',padding: 10,borderRadius: 5,backgroundColor: '#fff',marginBottom: 20,marginTop: 5,},subtitle: {fontSize: 22,fontWeight: 'bold',color: '#34495e',marginVertical: 15,},notaContainer: {padding: 15,marginBottom: 10,borderWidth: 1,borderRadius: 8,borderColor: '#ddd',},nota: {fontSize: 16,color: '#333',},buttonContainer: {flexDirection: 'row',justifyContent: 'space-between',},buttonEnviarAviso: {backgroundColor: '#00527C',padding: 10,borderRadius: 5,marginTop: 8,alignItems: 'center',},buttonEnviar: {backgroundColor: '#00527C',padding: 10,borderRadius: 5,marginTop: 35,alignItems: 'center',},buttonExcluir: {backgroundColor: '#ff6400',padding: 10,borderRadius: 5,marginTop: 35,},buttonText: {color: '#fff',fontSize: 16,},botaoFecharModal: {backgroundColor: '#ff6400',padding: 15,borderRadius: 8,alignItems: 'center',marginTop: 20,},textoBotaoFecharModal: {color: '#ffffff',fontSize: 16,fontWeight: '600',},
  });

  export default NotasProfessor;
