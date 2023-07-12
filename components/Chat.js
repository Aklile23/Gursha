// Imports
import {db} from '../src/firebase';
import uuid from 'react-native-uuid';
import {AuthContext} from '../context/Auth';
import {AntDesign} from '@expo/vector-icons';
import {useState, useContext, useEffect, useRef} from 'react';
import {doc, onSnapshot, updateDoc, arrayUnion, Timestamp} from 'firebase/firestore';
import {Modal, View, StyleSheet, Image, Text, TextInput, ScrollView, TouchableOpacity} from 'react-native';





// Main Function
const Chat = ({isChatOpened, setIsChatOpened, searchedUser, theme, setIsUserSearched, isProfile}) => {


  // Text input
  const [messages, setMessages] = useState([{}]);
  const [input, setInput] = useState('');
  const {user:registeredUser} = useContext(AuthContext);
  const combinedId = registeredUser?._id > searchedUser._id
  ? registeredUser?._id + searchedUser._id
  : searchedUser._id + registeredUser?._id;
  const scrollViewRef = useRef();



  // Send handler
  const sendHandler = async () => {
    try {
      setInput('');
      await updateDoc(doc(db, 'chats', combinedId), {
        messages:arrayUnion({
          id:uuid.v4(),
          input,
          senderId:registeredUser?._id,
          timestamp:Timestamp.now()
        })
      });
    } catch (err) {
      console.log(err);
    }
  };



  // Use effect
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', combinedId), doc => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return unsub;
  }, [combinedId]);



  return (
    <Modal visible={isChatOpened}>
      <View style={styles.container}>
        <View style={styles.backButton}>
            <TouchableOpacity
              onPress={() => {
                setIsChatOpened(false);
                !isProfile && setIsUserSearched(false);
              }}
              style={styles.backIcon}
            >
              <AntDesign name="arrowleft" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.chat}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated:true})}
        >
          <View style={styles.upperArea}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri:searchedUser.profilePic}}
                style={styles.image}
              />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{searchedUser.username}</Text>
            </View>
          </View>
          <View style={{paddingBottom:60}}>
            {messages.map(message => 
              message.senderId === searchedUser._id ? (
                <View style={styles.message} key={message.id}>
                  <Image
                    source={{uri:searchedUser.profilePic}}
                    style={styles.messageImage}
                  />
                  <Text style={styles.messageText}>{message.input}</Text>
                </View>
              ):(
                <View style={styles.userMessage} key={message.id}>
                  <Text style={[styles.userMessageText, {backgroundColor:theme.colors.primary}]}>{message.input}</Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={text => setInput(text)}
            style={styles.input}
            placeholderTextColor='#ccc'
            placeholder={`Send ${searchedUser?.username?.split(' ')[0]} a message...`}
          />
          {input && (
            <TouchableOpacity style={styles.sendContainer} onPress={sendHandler}>
              <Text style={[styles.sendText, {color:theme.colors.primary}]}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};





// Styles
const styles = StyleSheet.create({
  container:{
    width:'100%',
    height:'100%',
    backgroundColor:'#000'
  },
  backButton:{
    zIndex:1,
    width:'100%',
    borderColor:'#ccc',
    position:'absolute',
    borderBottomWidth:1,
    backgroundColor:'#000'
  },
  backIcon:{
    width:75,
    paddingLeft:20,
    paddingVertical:10
  },
  upperArea:{
    marginTop:80,
    paddingBottom:10,
    borderColor:'#ccc',
    borderBottomWidth:0.5,
  },
  imageContainer:{
    width:'100%',
    display:'flex',
    alignItems:'center'
  },
  image:{
    width:100,
    height:100,
    borderRadius:50,
    backgroundColor:'#fff'
  },
  nameContainer:{
    width :'100%'
  },
  name:{
    marginTop:10,
    color:'#fff',
    textAlign:'center',
  },
  chat:{
    paddingTop:50
  },
  message:{
    marginTop:10,
    display:'flex',
    paddingLeft:10,
    flexDirection:'row',
    alignItems:'flex-end'
  },
  userMessage:{
    marginTop:15,
    display:'flex',
    paddingRight:10,
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'flex-end'
  },
  messageImage:{
    width:40,
    height:40,
    borderRadius:30,
    backgroundColor:'#fff'
  },
  messageText:{
    color:'#fff',
    // width:'70%',
    marginLeft:10,
    paddingLeft:10,
    borderRadius:10,
    paddingRight:50,
    paddingVertical:10,
    borderBottomLeftRadius:0,
    backgroundColor:'#212124'
  },
  userMessageText:{
    // width:'70%',
    color:'#fff',
    marginLeft:10,
    paddingLeft:10,
    borderRadius:10,
    paddingRight:50,
    paddingVertical:10,
    borderBottomRightRadius:0
  },
  inputContainer:{
    width:'100%',
    display:'flex',
    borderTopWidth:1,
    borderColor:'#ccc',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  input:{
    width:'75%',
    color:'#fff',
    paddingTop:10,
    paddingLeft:20,
    paddingBottom:20
  },
  sendContainer:{
    width:'25%',
    marginTop:-10,
    display:'flex',
    paddingVertical:7,
    alignItems:'center',
    justifyContent:'center'
  },
  sendText:{
    fontSize:16
  }
});





// Export
export default Chat;