import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Alert, ScrollView } from 'react-native';
import SwipeGestures from 'react-native-swipe-gestures';
import fotoPerfilAnonima from '../../assets/FotosPerfil/Foto-perfil-Anonima.jpg'; // Importando a imagem

const Notificacoes = ({ navigation }) => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    adicionarNotificacao();
  }, []);

  const adicionarNotificacao = () => {
    const novaNotificacao = {
      id: Math.random().toString(),
      usuario: 'Usuario',
      atividade: 'reagiu ao seu comentário',
      fotoUsuario: fotoPerfilAnonima, // Usando a imagem importada
    };
    setNotificacoes(prevNotificacoes => [...prevNotificacoes, novaNotificacao]);
  };

  const excluirNotificacao = (id) => {
    setNotificacoes(prevNotificacoes => prevNotificacoes.filter(notificacao => notificacao.id !== id));
  };

  const handleLongPressNotification = (id) => {
    Alert.alert(
      'Opções',
      'O que você deseja fazer?',
      [
        { text: 'Cancelar', onPress: () => console.log('Cancelar') },
        { text: 'Excluir', onPress: () => excluirNotificacao(id) },
        { text: 'Visualizar', onPress: () => alert('Visualizar') }
      ],
      { cancelable: true }
    );
  };

  const onSwipeLeft = () => {
    // Não faz nada ao deslizar para a esquerda
  };

  const onSwipeRight = () => {
    navigation.navigate('HomeScreen'); // Volta para a tela HomeScreen ao deslizar para a direita
  };

  return (
    <SwipeGestures
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={{ velocityThreshold: 0.1, directionalOffsetThreshold: 80 }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {notificacoes.map((notificacao) => (
            <TouchableWithoutFeedback key={notificacao.id} onLongPress={() => handleLongPressNotification(notificacao.id)}>
              <View style={styles.notificacaoContainer}>
                <View style={styles.notificacaoContent}>
                  <Image source={notificacao.fotoUsuario} style={styles.fotoUsuario} /> {/* Usando a imagem importada */}
                  <Text style={styles.notificacaoTexto}>{`${notificacao.usuario} ${notificacao.atividade}`}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>
    </SwipeGestures>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    padding: 10,
  },
  scrollContainer: {
    width: '100%', 
  },
  notificacaoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 60, 
    padding: 15,
    width: '100%', // Ajusta para preencher 100% da largura do container principal
    elevation: 2, // Sombra para um efeito de elevação
  },
  notificacaoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Ajusta para preencher 100% da largura da notificação
  },
  fotoUsuario: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificacaoTexto: {
    fontSize: 16,
    color: '#333', // Cor do texto
  },
});

export default Notificacoes;
