import { StyleSheet } from "react-native-web";

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
        alignItems: "center",
        justifyContent:"center"  
    },

    titleLogin: {
        flex:"between",
        //backgroundColor:'blue',
        alignItems: "center",
        justifyContent:"center"
    },

    formLogin: {
        flex:"between",
        //backgroundColor:'green',
        alignItems: "center",
        justifyContent:"center",
        marginTop: 300
    },

    input: { 
        border: "2px solid #ffcbdb",
        outline: "none",
    },

    pageTitle: {
        color: "red",
        fontSize: 75,
    },
    botaoTo: {
        display: 1,
        alignItems: 'center',
        marginLeft: '25%',
        width: '50%',
        height: 30,
        backgroundColor: '#2e2e2e',
        borderRadius: 30,
    },
    textoTo: {
        color: 'white',
        padding: 5,
    },
})

export default styles;