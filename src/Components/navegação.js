import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import AlunoScreen from './AlunoScreen';
import ProfessorScreen from './ProfessorScreen';
import FuncionarioScreen from './FuncionarioScreen';
import GestaoScreen from './GestaoScreen';
import CadastroSenhaScreen from './CadastroSenhaScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Aluno" component={AlunoScreen} />
      <Stack.Screen name="Professor" component={ProfessorScreen} />
      <Stack.Screen name="Funcionario" component={FuncionarioScreen} />
      <Stack.Screen name="Gestao" component={GestaoScreen} />
      <Stack.Screen name="CadastroSenhaScreen" component={CadastroSenhaScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
