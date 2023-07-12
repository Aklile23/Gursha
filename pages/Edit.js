// Imoprts
import axios from 'axios';
import {SERVER_API} from '@env';
import awsconfig from '../src/aws-exports';
import {AuthContext} from '../context/Auth';
import {AntDesign} from '@expo/vector-icons';
import {Amplify, Storage} from 'aws-amplify';
import {useNavigate} from 'react-router-native';
import * as ImagePicker from 'expo-image-picker';
import {ActivityIndicator} from 'react-native-paper';
import {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
Amplify.configure(awsconfig);





// Main function
const Edit = ({theme}) => {



    // Navigator
    const navigate = useNavigate();  
    const {user, update} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState('');
    


    // Uploading image
    const [imagePreview, setImagePreview] = useState('');
    const [imageResult, setImageResult] = useState({});
    const [input, setInput] = useState({username:user.username, bio:user.bio});
    const fetchImageUri = async uri => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };
    const uploadFile = async file => {
        setIsLoading(true);
        const image = await fetchImageUri(file.assets[0].uri);
        return Storage.put(`image-${Math.random()}.png`, image, {
            level:'public',
            contentType:image.type
        })
        .then(res => {
            Storage.get(res.key)
            .then(async result => {
                let imageResultUri = result.substring(0, result.indexOf('?'));


                // Posting image
                if(imageResultUri.trim() !== ''){
                    try {
                        const link = `${SERVER_API}/users/update`;
                        await axios.put(link, {
                            previousUsername:user.username,
                            username:input.username,
                            bio:input.bio,
                            profilePic:imageResultUri
                        });
                        update({username:input.username, bio:input.bio, profilePic:imageResultUri});
                        setTimeout(() => {
                            setInput('');
                            setImagePreview('');
                            setImageResult({});
                            navigate('/');
                        }, 1000)
                    
                    } catch (err) {
                        console.log(err.response.data);
                    }
                };
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    };



    // Pick image
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[4, 3],
            quality:1
        });
        if (!result.canceled) {
            setImagePreview(result.assets[0].uri);
            setImageResult(result);
            console.log(result);
        }
    };



    // Posting image
    const postImage = async () => {
        setIsLoading(true);
        if(imageResult?.assets){
            uploadFile(imageResult);
        }else{
            try {
                const link = `${SERVER_API}/users/update`;
                await axios.put(link, {
                    userId:user._id,
                    username:input.username,
                    bio:input.bio,
                    profilePic:imagePreview ? user.profilePic : ''
                });
                update({username:input.username, bio:input.bio, profilePic:imagePreview ? user.profilePic : ''});
                setTimeout(() => {
                    setInput({username:'', bio:''});
                    setImagePreview('');
                    setImageResult({});
                    navigate('/');
                }, 1000)
            } catch (err) {
                console.log(err.response.data);
            }
        }
    };



    // Use effect
    useEffect(() => {
        setInput({username:user.username, bio:user.bio});
        setImagePreview(user.profilePic);
    }, []);



    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigate('/profile')} style={styles.backButton}>
                <AntDesign name="arrowleft" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.editProfileText}>Edit profile</Text>
            <View style={styles.bioContainer}>
                <Text style={styles.bioText}>Username</Text>
                <TextInput
                    value={input.username}
                    onChangeText={text => setInput({...input, username:text})}
                    style={[styles.input, {borderColor:theme.colors.primary}]}
                />
                <Text style={[styles.bioText, {marginTop:20}]}>Bio</Text>
                <TextInput
                    value={input.bio}
                    onChangeText={text => setInput({...input, bio:text})}
                    style={[styles.input, {borderColor:theme.colors.primary}]}
                />
            </View>
            <View style={styles.chooseProfileContainer}>
                <TouchableOpacity onPress={pickImage} style={[styles.chooseButtonContainer, {borderColor:theme.colors.primary}]}>
                    {imagePreview ? (
                        <View>
                            <Image
                            source={{uri:imagePreview}}
                            style={styles.image}
                            />
                        </View>
                    ) : (
                        <Text style={styles.chooseText}>profile picture</Text>
                    )}
                </TouchableOpacity>
                {imagePreview && (
                    <TouchableOpacity onPress={() => setImagePreview('')}>
                        <Text style={styles.remove}>Delete image</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={[styles.submitContainer, {backgroundColor:theme.colors.primary}]} onPress={postImage}>
                <Text style={styles.submitText}>Edit</Text>
            </TouchableOpacity>
            {isLoading && (
                <ActivityIndicator animating={true} color='#fff' size={50} style={{marginTop:50}}/>
            )}
        </View>
    );
};





// Styles
const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:50,
        display:'flex',
        alignItems:'center'
    },
    backButton:{
        zIndex:1,
        width:'100%',
        paddingLeft:10,
        paddingVertical:5,
        borderColor:'#ccc',
        position:'absolute',
        borderBottomWidth:0.5,
        backgroundColor:'#000'
    },
    editProfileText:{
        fontSize:20,
        color:'#fff',
        marginTop:30,
        marginBottom:20
    },
    bioContainer:{
        width:'80%'
    },
    bioText:{
        fontSize:15,
        color:'#fff',
        paddingBottom:5
    },
    input:{
        height:50,
        fontSize:13,
        color:'#fff',
        borderWidth:1,
        paddingLeft:15,
        borderRadius:5,
        backgroundColor:'#000'
    },
    chooseProfileContainer:{
        width:'80%',
        marginTop:20,
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
    },
    chooseButtonContainer:{
        width:150,
        height:150,
        borderWidth:1,
        display:'flex',
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center'
    },
    submitContainer:{
        marginTop:20,
        borderRadius:5,
        paddingVertical:10,
        paddingHorizontal:30
    },
    chooseText:{
        color:'#fff',
        fontSize:12
    },
    submitText:{
        color:'#fff'
    },
    image:{
        width:145,
        height:145,
        borderRadius:100
    },
    remove:{
        color:'#fff',
        marginLeft:20
    }
});





// Export
export default Edit;