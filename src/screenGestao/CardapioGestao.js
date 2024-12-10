import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { format, getISOWeek } from 'date-fns';
import axios from 'axios';
import { ThemeContext } from '../Components/ThemeContext';
import { FontSizeContext } from '../Components/FontSizeProvider';
import { LanguageContext } from '../Components/LanguageContext';

const CardapioGestao = () => {
  const [cardapio, setCardapio] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [pratos, setPratos] = useState({ prato1: '', prato2: '', prato3: '', prato4: '' });
  const [sobremesa, setSobremesa] = useState('');

  const { theme } = useContext(ThemeContext); // Acessa o tema atual do contexto
  const { getFontSize } = useContext(FontSizeContext);
  const { language } = useContext(LanguageContext); // Acessa o idioma

  const dataAtual = format(new Date(), 'dd/MM/yyyy');
  const numeroDaSemana = getISOWeek(new Date());

  // Função para obter o cardápio atualizado do banco de dados
  const obterCardapioAtualizado = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getCardapio');
      if (response.status === 200) {
        setCardapio(response.data);
      } else {
        Alert.alert('Aviso', 'Cardápio não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter cardápio:', error);
      Alert.alert('Erro', 'Falha ao obter o cardápio. Tente novamente');
    }
  };

  useEffect(() => {
    obterCardapioAtualizado();
  }, []);

  // Função para abrir o modal de edição
  const abrirModal = (index) => {
    setDiaSelecionado(index);
    if (index !== null) {
      const { prato1, prato2, prato3, prato4, sobremesa } = cardapio[index];
      setPratos({ prato1, prato2, prato3, prato4 });
      setSobremesa(sobremesa);
    }
    setModalVisible(true);
  };

  // Função para salvar alterações no cardápio (atualização ou inserção)
  const salvarAlteracoes = async () => {
    const novoCardapio = [...cardapio];
    const diaAtual = diaSelecionado !== null ? novoCardapio[diaSelecionado] : {};

    const dadosCardapio = {
      id_dia: diaAtual.id_dia || null, // ID será null para uma nova inserção
      diaSemana: diaAtual.diaSemana || 'Novo dia', // Valor padrão para novo dia
      prato1: pratos.prato1,
      prato2: pratos.prato2,
      prato3: pratos.prato3,
      prato4: pratos.prato4,
      sobremesa: sobremesa,
    };

    try {
      if (diaSelecionado !== null) {
        // Atualizar cardápio existente
        const response = await axios.put('http://localhost:3000/putCardapio', dadosCardapio);

        if (response.status === 200) {
          novoCardapio[diaSelecionado] = { ...dadosCardapio };
          setCardapio(novoCardapio);
          Alert.alert('Sucesso', 'Cardápio atualizado com sucesso');
        } else {
          throw new Error('Falha ao atualizar o cardápio');
        }
      } else {
        // Inserir novo item no cardápio
        const response = await axios.post('http://localhost:3000/postCardapio', dadosCardapio);

        if (response.status === 200) {
          setCardapio([...cardapio, response.data]);
          Alert.alert('Sucesso', 'Novo cardápio adicionado com sucesso');
        } else {
          throw new Error('Falha ao adicionar novo cardápio');
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar cardápio:', error);
      setModalVisible(false);
      Alert.alert('Erro', 'Falha ao salvar o cardápio. Tente novamente');
    }
  };

  return (
    <ScrollView style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
      <View style={styles.header}>
        <Text style={[
          styles.headerText,
          theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText,
          { fontSize: getFontSize() }
        ]}>
          {language === 'pt' ? 'Semana Atual:' : 'Current Week:'} {numeroDaSemana}
        </Text>
        <Text style={[
          styles.headerText,
          theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText,
          { fontSize: getFontSize() }
        ]}>
          {language === 'pt' ? 'Data:' : 'Date:'} {dataAtual}
        </Text>
      </View>

      {cardapio.map((item, index) => (
        <View key={index} style={[styles.weekDayContainer, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
          <View style={styles.fundoTitulo}>
            <Text style={[styles.weekDay, theme === 'escuro' ? styles.darkTitleText : styles.lightTitleText, { fontSize: getFontSize() }]}>
              {item.diaSemana}
            </Text>
            <TouchableOpacity onPress={() => abrirModal(index)} style={styles.editButton}>
              <Text style={[styles.editButtonText, { fontSize: getFontSize() }]}>
                {language === 'pt' ? 'Editar' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.menuContainer, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
            <Text style={[styles.cardapioLista, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
              {item.prato1}
            </Text>

            {item.prato2 && (
              <Text style={[styles.cardapioLista, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
                {item.prato2}
              </Text>
            )}

            {item.prato3 && (
              <Text style={[styles.cardapioLista, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
                {item.prato3}
              </Text>
            )}

            {item.prato4 && (
              <Text style={[styles.cardapioLista, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
                {item.prato4}
              </Text>
            )}

            {item.sobremesa ? (
              <Text style={[styles.dessert, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
                {language === 'pt' ? 'Sobremesa:' : 'Dessert:'} {item.sobremesa}
              </Text>
            ) : null}
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={() => abrirModal(null)} style={styles.addButton}>
        <Text style={[styles.addButtonText, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Adicionar Novo Cardápio' : 'Add New Menu'}
        </Text>
      </TouchableOpacity>

      {/* Modal para edição do cardápio */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
            <Text style={[styles.modalTitle, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
              {language === 'pt' ? 'Editar Cardápio' : 'Edit Menu'}
            </Text>

            <TextInput
              style={[styles.input, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}
              placeholder={language === 'pt' ? 'Prato 1' : 'Dish 1'}
              value={pratos.prato1}
              onChangeText={(text) => setPratos((prev) => ({ ...prev, prato1: text }))} />
            <TextInput
              style={[styles.input, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}
              placeholder={language === 'pt' ? 'Prato 2' : 'Dish 2'}
              value={pratos.prato2}
              onChangeText={(text) => setPratos((prev) => ({ ...prev, prato2: text }))} />
            <TextInput
              style={[styles.input, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}
              placeholder={language === 'pt' ? 'Prato 3' : 'Dish 3'}
              value={pratos.prato3}
              onChangeText={(text) => setPratos((prev) => ({ ...prev, prato3: text }))} />
            <TextInput
              style={[styles.input, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}
              placeholder={language === 'pt' ? 'Prato 4' : 'Dish 4'}
              value={pratos.prato4}
              onChangeText={(text) => setPratos((prev) => ({ ...prev, prato4: text }))} />
            <TextInput
              style={[styles.input, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}
              placeholder={language === 'pt' ? 'Sobremesa' : 'Dessert'}
              value={sobremesa}
              onChangeText={(text) => setSobremesa(text)} />

            <TouchableOpacity onPress={salvarAlteracoes} style={styles.saveButton}>
              <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
                {language === 'pt' ? 'Salvar' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
                {language === 'pt' ? 'Cancelar' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f0f0f0'}, darkTheme: {backgroundColor: '#292929'}, lightTheme: {backgroundColor: '#f9f9f9'}, darkText: {color: '#fff'}, lightText: {color: '#000000'}, darkTitleText: {color: '#000000'}, lightTitleText: {color: '#000000'}, header: {marginBottom: 20, padding: 10, backgroundColor: '#e0e0e0', borderRadius: 5}, headerText: {fontSize: 16, fontWeight: 'bold'}, weekDayContainer: {marginBottom: 20}, fundoTitulo: {backgroundColor: '#e0e0e0', padding: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, weekDay: {fontSize: 18, fontWeight: 'bold'}, menuContainer: {padding: 15, backgroundColor: '#f5f5f5', borderRadius: 5}, dessert: {fontStyle: 'italic'}, editButton: {backgroundColor: '#00527C', padding: 5, borderRadius: 5}, editButtonText: {color: '#fff'}, addButton: {backgroundColor: '#00527C', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20}, addButtonText: {color: '#fff', fontSize: 16}, modalContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}, modalContent: {width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 5}, modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 20}, input: {height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 5}, saveButton: {backgroundColor: '#00527C', padding: 10, borderRadius: 5, alignItems: 'center'}, cancelButton: {backgroundColor: '#ff6400', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10}, buttonText: {color: '#fff', fontSize: 16}, cardapioLista: {color: '#fff'}
});

export default CardapioGestao;