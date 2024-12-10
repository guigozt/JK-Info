import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SwipeGestures from 'react-native-swipe-gestures';

const ReclamacoesSugestGestao = () => {
  const navigation = useNavigation();

  const [mensagens, setMensagens] = useState([
    { id: '1', assunto: 'Problema com a plataforma', mensagem: 'Estou tendo dificuldades em acessar o sistema.', resposta: '' },
    { id: '2', assunto: 'Sugestão de melhorias', mensagem: 'Seria bom ter uma funcionalidade de lembrete.', resposta: '' },
  ]);

  const [resposta, setResposta] = useState('');
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const excluirMensagem = (id) => {
    setMensagens(mensagens.filter(mensagem => mensagem.id !== id));
    setModalVisible(false);
    Alert.alert('Mensagem excluída', 'A mensagem foi excluída com sucesso!');
  };

  const responderMensagem = (id) => {
    if (!resposta) {
      Alert.alert('Erro', 'Por favor, escreva uma resposta antes de enviar.');
      return;
    }

    const mensagensAtualizadas = mensagens.map(mensagem => 
      mensagem.id === id ? { ...mensagem, resposta } : mensagem
    );
    
    setMensagens(mensagensAtualizadas);
    setResposta('');
    setModalVisible(false);
    Alert.alert('Sucesso', 'Resposta enviada com sucesso!');
  };

  const abrirModal = (mensagem) => {
    setMensagemSelecionada(mensagem);
    setResposta(mensagem.resposta);
    setModalVisible(true);
  };

  const onSwipeLeft = () => {
    navigation.navigate('Home');
  };

  const renderMensagem = ({ item }) => (
    <TouchableOpacity onPress={() => abrirModal(item)} style={styles.mensagemContainer}>
      <Text style={styles.mensagemAssunto}>{item.assunto}</Text>
      <Text style={styles.mensagemTexto}>
        {item.mensagem.length > 50 ? `${item.mensagem.substring(0, 50)}...` : item.mensagem}
      </Text>
      {item.resposta !== '' && (
        <Text style={styles.respostaTexto}>Resposta: {item.resposta}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SwipeGestures
      onSwipeLeft={onSwipeLeft}
      config={{ velocityThreshold: 0.1, directionalOffsetThreshold: 80 }}
      style={styles.container}
    >
      <View style={styles.container}>
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderMensagem}
        />

        {mensagemSelecionada && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalAssunto}>{mensagemSelecionada.assunto}</Text>
                <Text style={styles.modalMensagem}>{mensagemSelecionada.mensagem}</Text>

                <TextInput
                  style={styles.inputResposta}
                  placeholder="Escreva sua resposta..."
                  value={resposta}
                  onChangeText={setResposta}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => responderMensagem(mensagemSelecionada.id)}
                >
                  <Text style={styles.buttonText}>Responder</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.excluirButton]}
                  onPress={() => excluirMensagem(mensagemSelecionada.id)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.fecharButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SwipeGestures>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  mensagemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  mensagemAssunto: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  mensagemTexto: {
    fontSize: 14,
    marginBottom: 10,
  },
  respostaTexto: {
    color: 'green',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalAssunto: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalMensagem: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputResposta: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00527C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  excluirButton: {
    backgroundColor: '#b81414',
  },
  fecharButton: {
    backgroundColor: '#ff6400',
  },
  buttonText: {
    color: '#fff',
  },
});

export default ReclamacoesSugestGestao;