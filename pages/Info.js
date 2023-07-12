// Imoprts
import axios from 'axios';
import {SERVER_API} from '@env';
import awsconfig from '../src/aws-exports';
import {AuthContext} from '../context/Auth';
import {Amplify, Storage} from 'aws-amplify';
import {useNavigate} from 'react-router-native';
import * as ImagePicker from 'expo-image-picker';
import {ActivityIndicator} from 'react-native-paper';
import {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
Amplify.configure(awsconfig);





// Main function
const Info = ({theme}) => {



  // Navigator
  const navigate = useNavigate();  
  const {user, update} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  


  // Uploading image
  const [imagePreview, setImagePreview] = useState('');
  const [imageResult, setImageResult] = useState({});
  const [input, setInput] = useState();
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
              userId:user._id,
              bio:input,
              profilePic:imageResultUri
            });
            update({bio:input, profilePic:imageResultUri});
            setTimeout(() => {
              setInput('');
              setImagePreview('');
              setImageResult({});
              navigate('/');
            }, 1000)
          
          } catch (err) {
            console.log(err);
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
    }
  };



  // Posting image
  const postImage = async () => {
    if(imagePreview){
      uploadFile(imageResult);
    }else{
      setIsLoading(true);
      try {
        const link = `${SERVER_API}/users/update`;
        await axios.put(link, {
          userId:user._id,
          bio:input
        });
        update({bio:input});
        setTimeout(() => {
          setInput('');
          setImagePreview('');
          setImageResult({});
          navigate('/');
        }, 1000);
      } catch (err) {
        console.log(err);
      }
    }
  };



  // Use effect
  useEffect(() => {
    if(user.bio.trim() !== ''){
      setInput('');
      setImagePreview('');
      setImageResult({});
      navigate('/');
    };
  }, []);



  return (
      <View style={styles.container}>
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>Bio</Text>
          <TextInput
            value={input}
            onChangeText={text => setInput(text)}
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
              <Text style={styles.remove}>Remove image</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.submitContainer, {backgroundColor:theme.colors.primary}]} onPress={postImage}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipContainer} onPress={() => {setIsLoading(true);navigate('/')}}>
          <Text style={{color:theme.colors.primary}}>Skip</Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator animating={true} color='#fff' size={50} style={{marginTop:50}}/>}
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
  },
  skipContainer:{
    marginTop:50,
    alignItems:'center'
  }
});





// Export
export default Info;