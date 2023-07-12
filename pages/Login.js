// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import {auth} from '../src/firebase';
import {useContext, useState} from 'react';
import {AuthContext} from '../context/Auth';
import {useNavigate} from 'react-router-native';
import {ActivityIndicator} from 'react-native-paper';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {Form, FormItem, Label} from 'react-native-form-component';





// Main Function
const Login = ({theme}) => {


    // Values
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        username:'',
        password:'',
    });


    // Registering user
    const registerUser = async () => {
        setIsLoading(true);
        setErrors({});
        try {
            const link = `${SERVER_API}/users/login`;
            const res = await axios.post(link, values);
            setIsLoading(false);
            setIsClicked(true);
            context.login(res.data);
            await signInWithEmailAndPassword(auth, res.data.email, values.password);
            setValues({
                username:'',
                password:''
            });
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setErrors(err.response.data);
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.loginTextContainer}>
                <Text style={styles.text}>Login to</Text>
                <Text style={{color:theme.colors.primary, paddingLeft:10, fontSize:25}}>Gursha</Text>
            </View>
            <ScrollView style={styles.formContainer}>
                <Form
                    buttonStyle={[styles.buttonStyle, {backgroundColor:theme.colors.primary, marginTop:errors.password ? 20 : 0}]}
                    onButtonPress={registerUser}
                >
                    <FormItem
                        label='Username'
                        value={values.username}
                        labelStyle={styles.label}
                        onChangeText={text => setValues({...values, username:text})}
                    />
                    {errors.username && <Label text={errors.username} style={styles.errorMessage} textStyle={styles.errorText}/>}
                    <FormItem
                        label='Password'
                        secureTextEntry
                        labelStyle={[styles.label, {marginTop:errors.email ? 20 : 0}]}
                        value={values.password}
                        onChangeText={text => setValues({...values, password:text})}
                    />
                    {errors.password && <Label text={errors.password} style={styles.errorMessage} textStyle={styles.errorText}/>}
                </Form>
                {isLoading && (
                    <ActivityIndicator animating={true} color='#fff' size={50}/>
                )}
                {isClicked && (
                    <View style={styles.loginUser}>
                        <Text style={styles.loginUserText}>Loging user...</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
};





// Styles
const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        display:'flex',
        alignItems:'center',
        backgroundColor:'#000'
    },
    loginTextContainer:{
        width:'100%',
        display:'flex',
        paddingTop:20,
        flexDirection:'row',
        justifyContent:'center'
    },
    text:{
        color:'#fff',
        fontSize:25
    },
    formContainer:{
        width:'80%',
        marginTop:'10%'
    },
    buttonStyle:{
        marginTop:0   
    },
    label:{
        color:'#fff',
        marginBottom:5
    },
    errorMessage:{
        borderRadius:5,
        marginTop:-15,
        paddingVertical:5,
        paddingHorizontal:15,
        backgroundColor:'#ff3333'
    },
    errorText:{
        fontSize:12,
        color:'#fff'
    },
    loginUser:{
        borderRadius:5,
        paddingVertical:5,
        paddingHorizontal:10,
        backgroundColor:'#5cb85c'
    },
    loginUserText:{
        color:'#fff',
        textAlign:'center'
    }
});





// Export
export default Login;