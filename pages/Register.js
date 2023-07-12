// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import {db} from '../src/firebase';
import {auth} from '../src/firebase';
import {useContext, useState} from 'react';
import {AuthContext} from '../context/Auth';
import {doc, setDoc} from "firebase/firestore";
import {useNavigate} from 'react-router-native';
import {ActivityIndicator} from 'react-native-paper';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {Form, FormItem, Label} from 'react-native-form-component';





// Main Function
const Register = ({theme}) => {


    // Values
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    });


    // Registering user
    const registerUser = async () => {
        setIsLoading(true);
        try {
            setErrors({});
            const link = `${SERVER_API}/users/register`;
            const res = await axios.post(link, values);
            setIsClicked(true);
            setIsLoading(false);
            context.login(res.data);


            // Firebase user
            createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(() => {
                setDoc(doc(db, 'users', res.data._id), {
                    id:res.data._id,
                    email:values.email,
                    username:values.username
                });
                setDoc(doc(db, 'userChats', res.data._id), {});
            })
            .catch(e => console.log(e));


            setValues({
                username:'',
                email:'',
                password:'',
                confirmPassword:''
            });
            setTimeout(() => {
                navigate('/info');
            }, 1000);
        } catch (err) {
            setErrors(err.response.data);
            setIsLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.loginTextContainer}>
                <Text style={styles.text}>Register to</Text>
                <Text style={{color:theme.colors.primary, paddingLeft:10, fontSize:25}}>Gursha</Text>
            </View>
            <ScrollView style={styles.formContainer}>
                <Form
                    buttonStyle={[styles.buttonStyle, {backgroundColor:theme.colors.primary, marginTop:errors.confirmPassword ? 20 : 0}]}
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
                        label='Email'
                        value={values.email}
                        labelStyle={[styles.label, {marginTop:errors.username ? 20 : 0}]}
                        onChangeText={text => setValues({...values, email:text})}
                    />
                    {errors.email && <Label text={errors.email} style={styles.errorMessage} textStyle={styles.errorText}/>}
                    <FormItem
                        label='Password'
                        secureTextEntry
                        labelStyle={[styles.label, {marginTop:errors.email ? 20 : 0}]}
                        value={values.password}
                        onChangeText={text => setValues({...values, password:text})}
                    />
                    {errors.password && <Label text={errors.password} style={styles.errorMessage} textStyle={styles.errorText}/>}
                    <FormItem
                        label='Confirm password'
                        secureTextEntry
                        labelStyle={[styles.label, {marginTop:errors.password ? 20 : 0}]}
                        value={values.confirmPassword}
                        onChangeText={text => setValues({...values, confirmPassword:text})}
                    />
                    {errors.confirmPassword && <Label text={errors.confirmPassword} style={styles.errorMessage} textStyle={styles.errorText}/>}
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
export default Register;