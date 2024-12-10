  import React, { useState, useEffect, useContext } from 'react';
  import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Image, Modal, TextInput, Alert } from 'react-native';
  import axios from 'axios';
  import Icon from 'react-native-vector-icons/Ionicons';
  import fotoPerfilAnonima from '../../assets/FotosPerfil/Foto-perfil-Anonima.jpg';
  import { ThemeContext } from '../Components/ThemeContext';
  import { LanguageContext } from '../Components/LanguageContext';
  import { FontSizeContext } from '../Components/FontSizeProvider';

  // Componente de Avatar
  const Avatar = () => (
    <Image source={fotoPerfilAnonima} style={styles.avatarImage} />
  );

    // Componente de Usuário
    const Usuario = ({ nome, cargo, theme }) => {
      const { fontSize } = useContext(FontSizeContext); // Obtenha o tamanho de fonte do contexto
    
      return (
        <View style={styles.informacoesPublicacao}>
          <Text
            style={[
              theme === 'escuro' ? styles.darkText : styles.lightText,
              { fontSize } // Aplica o tamanho de fonte dinâmico no nome
            ]}
          >
            {nome}
          </Text>
          <Text
            style={[
              theme === 'escuro' ? styles.darkText : styles.lightText,
              { fontSize } // Aplica o tamanho de fonte dinâmico no cargo também
            ]}
          >
            {cargo}
          </Text>
        </View>
      );
    };

  // Componente de Botão de Comentar
  const BotaoComentar = ({ onPress, comentarioCount }) => {
    const { language } = useContext(LanguageContext); // Acessa o contexto de idioma
    const { fontSize } = useContext(FontSizeContext); // Acessa o contexto de tamanho de fonte
  
    return (
      <View style={styles.containerBotao}>
        <TouchableOpacity onPress={onPress} style={styles.botao}>
          <Text style={[styles.botaoTexto, { fontSize }]}>
            {language === 'pt' ? `Comentar (${comentarioCount})` : `Comment (${comentarioCount})`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // Componente de Botão de Excluir
  const BotaoExcluir = ({ onPress }) => {
    const { language } = useContext(LanguageContext); // Acessa o contexto de idioma
    const { fontSize } = useContext(FontSizeContext); // Acessa o contexto de tamanho de fonte
  
    return (
      <View style={styles.containerBotaoExcluir}>
        <TouchableOpacity onPress={onPress} style={styles.botaoExcluir}>
          <Text style={[styles.botaoTexto, { fontSize }]}>
            {language === 'pt' ? 'Excluir' : 'Delete'} {/* Troca do texto com base no idioma */}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const Curtir = ({ count, liked, onPress, theme }) => {
    const { fontSize } = useContext(FontSizeContext); // Acessa o contexto de tamanho de fonte
  
    return (
      <View style={[styles.containerCurtir, theme === 'escuro' ? styles.darkText : styles.lightText]}>
        <TouchableOpacity onPress={onPress}>
          <Icon
            name={liked ? "heart" : "heart-outline"} // Alterna entre coração preenchido e contornado
            size={24}
            color={liked ? '#FF0000' : '#FF0000'} // Mantém a borda vermelha nos dois estados
          />
        </TouchableOpacity>
        <Text style={[styles.curtidasTexto, { fontSize }, theme === 'escuro' ? { color: '#FFFFFF' } : styles.lightText]}>
          {count}
        </Text>
      </View>
    );
  };

  const CurtirComentario = ({ count, liked, onPress, theme }) => {
    const { fontSize } = useContext(FontSizeContext); // Acessa o contexto de tamanho de fonte
  
    return (
      <View style={[styles.containerCurtir, theme === 'escuro' ? styles.darkText : styles.lightText]}>
        <TouchableOpacity onPress={onPress}>
          <Icon
            name={liked ? "heart" : "heart-outline"} // Alterna entre coração preenchido e coração com borda
            size={24}
            color={liked ? '#FF0000' : '#FF0000'} // O coração sempre terá a borda vermelha
          />
        </TouchableOpacity>
        <Text style={[styles.curtidasTexto, { fontSize }, theme === 'escuro' ? { color: '#FFFFFF' } : styles.lightText]}>
          {count}
        </Text>
      </View>
    );
  };

  // Componente Modal de Comentários
  const CommentModal = ({ visible, onClose, comments, onCommentAdded, publicacaoId }) => {
    const [textoComentario, setTextoComentario] = useState('');
    const { theme } = useContext(ThemeContext);
    const { language } = useContext(LanguageContext); // Acesse o idioma
    const { getFontSize, changeFontSize } = useContext(FontSizeContext);
    
    const handleSendComment = async () => {
      if (textoComentario.trim()) {
          try {
              const token = await AsyncStorage.getItem('jwtToken'); // Obtém o token JWT
              const response = await axios.post(
                  'http://localhost:3000/postcomentario',
                  {
                      text: textoComentario,
                      Publicacao_idPublicacao: publicacaoId,
                  },
                  {
                      headers: { Authorization: `Bearer ${token}` }, // Adiciona o token ao cabeçalho
                  }
              );
  
              console.log('Resposta do servidor:', response.data);
  
              // Atualiza a lista de comentários localmente
              onCommentAdded({
                  texto: textoComentario,
                  nome_comentador: 'Você', // Substitua por `response.data.nome` se necessário
                  num_likes: 0,
              });
  
              setTextoComentario(''); // Limpa o campo de texto
          } catch (error) {
              console.error('Erro ao enviar comentário:', error);
              Alert.alert('Erro', 'Falha ao enviar o comentário.');
          }
      } else {
          Alert.alert('Atenção', 'Por favor, insira um comentário.');
      }
  };
  

  const handleLikeComment = async (commentId) => {
    const isLiked = comments.find(comment => comment.idComentario === commentId)?.liked || false;

    try {
        const token = await AsyncStorage.getItem('jwtToken'); // Obtém o token JWT
        const response = await axios.post(
            'http://localhost:3000/likecomentario',
            {
                idComentario: commentId,
                liked: !isLiked,
            },
            {
                headers: { Authorization: `Bearer ${token}` }, // Adiciona o token ao cabeçalho
            }
        );

        const newCount = response.data.numLikes;

        // Atualiza a contagem de curtidas localmente
        onCommentAdded(
            comments.map(comment =>
                comment.idComentario === commentId
                    ? { ...comment, num_likes: newCount, liked: !isLiked }
                    : comment
            )
        );
    } catch (error) {
        console.error('Erro ao curtir comentário:', error);
        Alert.alert('Erro', 'Falha ao curtir o comentário. Tente novamente.');
    }
};

  return (
  <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
            <Text style={[styles.modalTitle, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
              {language === 'pt' ? 'Comentários' : 'Comments'} {/* Título do Modal */}
            </Text>
            <ScrollView style={[styles.comentariosContainer, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
              {Array.isArray(comments) && comments.map((comment) => (
                <View key={comment.idComentario} style={[styles.comentarioContainer, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
                  <Image source={fotoPerfilAnonima} style={styles.avatarComment} />
                  <View style={styles.comentarioTextoContainer}>
                    <Text style={[styles.nomeAutor, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
                      {comment.nome_comentador}
                    </Text>
                    <Text style={[styles.comentarioTexto, theme === 'escuro' ? styles.darkText : styles.lightText, { fontSize: getFontSize() }]}>
                      {comment.texto}
                    </Text>
                  </View>
                  <CurtirComentario
                    count={comment.num_likes}
                    liked={comment.liked}
                    onPress={() => handleLikeComment(comment.idComentario)}
                  />
                </View>
              ))}
            </ScrollView>
            <TextInput
              style={[styles.input, theme === 'escuro' ? styles.darkText : styles.lightText,
                { fontSize: getFontSize() },
              ]} 
              placeholder={language === 'pt' ? 'Escreva um comentário...' : 'Write a comment...'}
              value={textoComentario}
              onChangeText={setTextoComentario}
            />
            <TouchableOpacity onPress={handleSendComment} style={styles.sendButton}>
              <Text style={[styles.sendButtonText, { fontSize: getFontSize() }]}>
                {language === 'pt' ? 'Enviar' : 'Send'} {/* Texto do botão Enviar */}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { fontSize: getFontSize() }]}>
                {language === 'pt' ? 'Fechar' : 'Close'} {/* Texto do botão Fechar */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Componente principal HomeScreenGestao
  import AsyncStorage from '@react-native-async-storage/async-storage';
  const HomeScreenGestao = () => {
    const [publicacoes, setPublicacoes] = useState([]);
    const [filteredPublicacoes, setFilteredPublicacoes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComments, setSelectedComments] = useState([]);
    const [newPostText, setNewPostText] = useState('');
    const [likes, setLikes] = useState({});
    const [currentPostId, setCurrentPostId] = useState(null);
    const [searchText, setSearchText] = useState(''); // Estado para texto de busca
    const { theme } = useContext(ThemeContext); // Pegando o tema do contexto
    const { language } = useContext(LanguageContext); // Acessa o idioma do context
    const { getFontSize, changeFontSize } = useContext(FontSizeContext);
    
    const fetchPublicacoes = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken'); // Obtém o token de autenticação
        const response = await axios.get('http://localhost:3000/getpublicacao', {
          headers: { Authorization: `Bearer ${token}` }, // Inclui o token no cabeçalho
        });
        setPublicacoes(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar publicações:', error);
      }
    };

    const fetchComments = async (postId) => {
      try {
          const token = await AsyncStorage.getItem('jwtToken'); // Obtém o token JWT do armazenamento
          const response = await axios.get(
              `http://localhost:3000/getcomentarios/${postId}`,
              {
                  headers: { Authorization: `Bearer ${token}` }, // Adiciona o token ao cabeçalho
              }
          );
          setSelectedComments(response.data); // Atualiza o estado com os comentários
      } catch (error) {
          console.error('Erro ao buscar comentários:', error);
          Alert.alert('Erro', 'Não foi possível carregar os comentários.');
      }
  };


    const handleSearch = (text) => {
      setSearchText(text);
      
      // Se o campo de pesquisa estiver vazio, mostrar todas as publicações
      if (text === '') {
        setFilteredPublicacoes(publicacoes);
      } else {
        // Filtrar as publicações com base no texto inserido
        const filtered = publicacoes.filter(pub => 
          pub.publicacao_descricao.toLowerCase().includes(text.toLowerCase()) || 
          pub.nome_pessoa.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredPublicacoes(filtered);
      }
    };
    
    useEffect(() => {
      fetchPublicacoes();
    }, []);

    useEffect(() => {
      // Sempre que as publicações forem alteradas, resetar as publicações filtradas
      setFilteredPublicacoes(publicacoes);
    }, [publicacoes]);

    const handleLike = async (postId) => {
      const isLiked = likes[postId] || false;
  
      setLikes((prev) => ({ ...prev, [postId]: !isLiked }));
  
      try {
          const token = await AsyncStorage.getItem('jwtToken');
          const response = await axios.post(
              'http://localhost:3000/likepublicacao',
              {
                  idPublicacao: postId,
                  liked: !isLiked,
              },
              {
                  headers: { Authorization: `Bearer ${token}` },
              }
          );
  
          const newCount = response.data.numLikes;
  
          setPublicacoes((prev) =>
              prev.map((pub) =>
                  pub.idPublicacao === postId ? { ...pub, quantidade_curtidas: newCount } : pub
              )
          );
      } catch (error) {
          console.error('Erro ao curtir a publicação:', error);
          setLikes((prev) => ({ ...prev, [postId]: isLiked })); // Reverte o like em caso de erro
          Alert.alert('Erro', 'Falha ao curtir a publicação. Tente novamente.');
      }
  };
  

    const handleCommentUpdate = (newComment) => {
      setSelectedComments(prev => [...prev, newComment]);
    };

  // Função para excluir publicação
  const handleDeletePost = async (idPublicacao) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.delete(
        `http://localhost:3000/deletepublicacao/${idPublicacao}`, 
         {headers: {Authorization: `Bearer ${token}`}}
      );
      if (response.status === 200) {
        console.log('Publicação excluída com sucesso.');
        // Remove a publicação do estado local
        setPublicacoes((prevPublicacoes) => 
          prevPublicacoes.filter((pub) => pub.idPublicacao !== idPublicacao)
        );
      }
    } catch (error) {
      console.error('Erro ao excluir publicação:', error);
      Alert.alert('Erro', 'Falha ao excluir a publicação. Tente novamente.');
    }
  };

    const handleCreatePost = async () => {
      if (newPostText.trim()) {
        try {
          const token = await AsyncStorage.getItem('jwtToken');
          const response = await axios.post(
            'http://localhost:3000/postpublicacao', 
           {descricao: newPostText},
            {headers: {Authorization: `Bearer ${token}`}}
          );
          console.log('Resposta do servidor:', response.data); 
          setNewPostText('');
          fetchPublicacoes(); // Atualiza a lista de publicações
        } catch (error) {
          console.error('Erro ao criar a publicação:', error);
          Alert.alert('Erro', 'Falha ao criar a publicação.');
        }
      } else {
        Alert.alert('Atenção', 'Digite algo para criar uma publicação.');
      }
    };

const renderPublicacao = (pub) => (
  <View
    style={[styles.boxPubli, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}
    key={pub.idPublicacao}
  >
    <View style={styles.indent}>
      <Avatar />
      <Usuario nome={pub.nome_pessoa} cargo={pub.cargo} theme={theme} />
    </View>
    <Text
      style={[
        theme === 'escuro' ? styles.darkText : styles.lightText,
        { fontSize: getFontSize() } // Aplicando o tamanho de fonte dinâmico
      ]}
    >
      {pub.publicacao_descricao}
    </Text>
    <View style={styles.actionsRow}>
      <Curtir
        count={pub.quantidade_curtidas}
        liked={likes[pub.idPublicacao]}
        onPress={() => handleLike(pub.idPublicacao)}
      />
      <View style={styles.commentDeleteRow}>
        <BotaoComentar
          onPress={async () => {
            await fetchComments(pub.idPublicacao); // Buscar comentários ao abrir o modal
            setCurrentPostId(pub.idPublicacao); // Define o ID da publicação atual
            setModalVisible(true);
          }}
          comentarioCount={pub.quantidade_comentarios}
        />
        <BotaoExcluir onPress={() => handleDeletePost(pub.idPublicacao)} />
      </View>
    </View>
  </View>
);

return (
  <View style={[styles.container, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
    {/* Barra de Pesquisa */}
    <TextInput
      style={[
        styles.searchBar,
        theme === 'escuro' ? styles.darkText : styles.lightText,
        { fontSize: getFontSize() } // Aplicando o tamanho de fonte dinâmico na barra de pesquisa
      ]}
      placeholder={language === 'pt' ? 'Pesquise por publicações ou autores...' : 'Search for posts or authors...'}
      value={searchText}
      onChangeText={handleSearch}
    />
    
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}>
      {/* Renderiza as publicações filtradas */}
      {filteredPublicacoes.map(renderPublicacao)}
    </ScrollView>

    {/* Fixa a área de criação de publicações na parte inferior */}
    <View style={[styles.fixedFooter, theme === 'escuro' ? styles.darkTheme : styles.lightTheme]}>
      <TextInput
        style={[
          styles.inputPost,
          theme === 'escuro' ? styles.darkText : styles.lightText,
          { fontSize: getFontSize() } // Aplicando o tamanho de fonte dinâmico na área de criação de publicações
        ]}
        placeholder={language === 'pt' ? 'Escreva uma publicação...' : 'Write a post...'}
        value={newPostText}
        onChangeText={setNewPostText}
      />
      <TouchableOpacity style={styles.sendPostButton} onPress={handleCreatePost}>
        <Text style={[styles.sendPostButtonText, { fontSize: getFontSize() }]}>
          {language === 'pt' ? 'Publicar' : 'Post'} {/* Texto do botão de publicar */}
        </Text>
      </TouchableOpacity>
    </View>

    <CommentModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      comments={selectedComments}
      onCommentAdded={handleCommentUpdate}
      publicacaoId={currentPostId} // Passa o ID da publicação atual
    />
  </View>
  );
};

  const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#f9f9f9',paddingHorizontal: 20,},searchBar: {marginBottom: 16,padding: 10,borderRadius: 8,borderWidth: 1,borderColor: '#ccc',marginTop: 16,paddingHorizontal: 10,marginVertical: 10,},searchInput: {height: 40,borderColor: '#007BFF',borderWidth: 1,borderRadius: 20,paddingHorizontal: 10,marginVertical: 10,},actionsRow: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',marginTop: 10,},commentDeleteRow: {flexDirection: 'row',alignItems: 'center',marginLeft: 10,},scrollView: {flex: 1,},boxPubli: {marginVertical: 10,borderWidth: 1,borderColor: '#ccc',borderRadius: 10,padding: 10,backgroundColor: '#f9f9f9',},darkTheme: {backgroundColor: '#292929',},lightTheme: {backgroundColor: '#f9f9f9',},darkText: {color: '#FFFFFF',},lightText: {color: '#000000',},indent: {flexDirection: 'row',alignItems: 'center',marginBottom: 10,},boxFeed: {marginBottom: 10,},textoPubli: {fontSize: 16,marginBottom: 10,},postImage: {width: '100%',height: 500,borderRadius: 10,},bottons: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',},avatarImage: {width: 40,height: 40,borderRadius: 20,marginRight: 10,},informacoesPublicacao: {marginLeft: 10,},containerBotao: {flex: 1,alignItems: 'flex-end',justifyContent: 'start'},containerBotaoExcluir: {flex: 1,alignItems: 'flex-end',justifyContent: 'start'},botao: {paddingVertical: 5,paddingHorizontal: 10,backgroundColor: '#00527C',borderRadius: 20,margin: 5,maxWidth: 100,minWidth: 110},botaoExcluir: {paddingVertical: 5,paddingHorizontal: 10,backgroundColor: '#ff6400',borderRadius: 20,margin: 5,},botaoTexto: {color: '#fff',},containerCurtir: {flexDirection: 'row',alignItems: 'center',},curtidasTexto: {marginLeft: 5,},modalOverlay: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0,0,0,0.5)',},modalContainer: {width: '80%',backgroundColor: 'white',borderRadius: 10,padding: 20,},modalTitle: {fontSize: 18,marginBottom: 10,textAlign: 'center',},comentariosContainer: {maxHeight: 200,},comentarioContainer: {flexDirection: 'row',alignItems: 'flex-start',marginBottom: 10,},avatarComment: {width: 30,height: 30,borderRadius: 15,marginRight: 10,},comentarioTextoContainer: {flex: 1,marginRight: 10,},nomeAutor: {fontWeight: 'bold',},comentarioTexto: {marginBottom: 5,},input: {borderWidth: 1,borderColor: '#ccc',borderRadius: 5,padding: 10,marginBottom: 10,},inputPost:{borderWidth: 1,borderColor: '#ccc',borderRadius: 5,padding: 10,marginBottom: 10,},sendButton: {backgroundColor: '#00527C',borderRadius: 5,paddingVertical: 10,alignItems: 'center',marginBottom: 10,},sendPostButton:{backgroundColor: '#00527C',borderRadius: 5,paddingVertical: 10,alignItems: 'center',marginBottom: 10,},sendButtonText: {color: 'white',},sendPostButtonText:{color: 'white',},fixedFooter: {position: 'absolute',bottom: 0,left: 0,right: 0,backgroundColor: '#fff',padding: 10,borderTopWidth: 1,borderColor: '#ccc',zIndex: 1,},closeButton: {backgroundColor: '#ff6400',borderRadius: 10,paddingVertical: 10,marginTop: 10,alignItems: 'center',},closeButtonText: {color: 'white',},floatingButton: {position: 'absolute',bottom: 30,right: 30,width: 60,height: 60,backgroundColor: '#ff6400',borderRadius: 30,alignItems: 'center',justifyContent: 'center',elevation: 5,},newPostInput: {height: 40,borderColor: '#ccc',borderWidth: 1,borderRadius: 10,padding: 10,marginBottom: 10,},deleteButton: {padding: 5,backgroundColor: '#ff4d4d',borderRadius: 5,},deleteButtonText: {color: 'white',},dateText: {fontSize: 12,color: '#888',marginTop: 5,},floatingButton: {position: 'absolute',bottom: 30,right: 30,width: 60,height: 60,backgroundColor: '#007BFF',borderRadius: 30,justifyContent: 'center',alignItems: 'center',},floatingButtonText: {color: 'white',fontSize: 30,},createPostButton: {backgroundColor: '#00527C',borderRadius: 10,paddingVertical: 10,marginBottom: 10,alignItems: 'center',},createPostButtonText: {color: '#fff',fontSize: 16,}
  });

  export default HomeScreenGestao;