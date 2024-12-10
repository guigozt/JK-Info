import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { format, getISOWeek } from 'date-fns';
import axios from 'axios';
import { ThemeContext } from '../Components/ThemeContext';
import { FontSizeContext } from '../Components/FontSizeProvider';
import { LanguageContext } from '../Components/LanguageContext';

const Cardapio = () => {
  const [cardapio, setCardapio] = useState([]);
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f0f0f0'}, darkTheme: {backgroundColor: '#292929'}, lightTheme: {backgroundColor: '#f9f9f9'}, darkText: {color: '#fff'}, lightText: {color: '#000000'}, darkTitleText: {color: '#000000'}, lightTitleText: {color: '#000000'}, header: {marginBottom: 20, padding: 10, backgroundColor: '#e0e0e0', borderRadius: 5}, headerText: {fontSize: 16, fontWeight: 'bold'}, weekDayContainer: {marginBottom: 20}, fundoTitulo: {backgroundColor: '#e0e0e0', padding: 10, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, weekDay: {fontSize: 18, fontWeight: 'bold'}, menuContainer: {padding: 15, backgroundColor: '#f5f5f5', borderRadius: 5}, dessert: {fontStyle: 'italic'}, editButton: {backgroundColor: '#00527C', padding: 5, borderRadius: 5}, editButtonText: {color: '#fff'}, addButton: {backgroundColor: '#00527C', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20}, addButtonText: {color: '#fff', fontSize: 16}, modalContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}, modalContent: {width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 5}, modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 20}, input: {height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 5}, saveButton: {backgroundColor: '#00527C', padding: 10, borderRadius: 5, alignItems: 'center'}, cancelButton: {backgroundColor: '#ff6400', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10}, buttonText: {color: '#fff', fontSize: 16}, cardapioLista: {color: '#fff'}
})

export default Cardapio;