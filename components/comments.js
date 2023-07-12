// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import {AuthContext} from '../context/Auth';
import {FormItem} from 'react-native-form-component';
import {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, ScrollView, Keyboard, Image, TouchableOpacity} from 'react-native';





// Main Function
const Comments = ({isCommentsOpened, setIsCommentsOpened, post, theme, setIsCommentPosted, isCommentPosted}) => {




  // User
  const {user} = useContext(AuthContext);



  // Keyboard listener
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    function onKeyboardDidShow(e) {
      setIsKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    }
    function onKeyboardDidHide() {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    }
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
  }, []);



  // Post comment
  const [input, setInput] = useState('');
  const commentPoster = async () => {
    try {
      if(user){
        const link = `${SERVER_API}/posts/comment/${post?._id}`
        const res = await axios.put(link, {userId:user._id, body:input, profilePic:user.profilePic});
        setInput('');
        setIsCommentPosted(!isCommentPosted);
        console.log(res.data);
      }else{
        console.log('No user assigned.');
      }
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <View style={[styles.container, {display:isCommentsOpened ? 'flex' : 'none'}]}>
      <View style={styles.top}>
        <Text style={styles.commentCount}>{post.commentsCount} comments</Text>
        <TouchableOpacity style={styles.closeIconContainer} onPress={() => setIsCommentsOpened(false)}>
          <Text style={styles.closeIcon}>x</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {post.comments?.map(comment => (
          <View style={styles.comment}>
            {comment?.profilePic ? (
              <Image
                source={{uri:comment.profilePic}}
                style={styles.image}
              />
            ) : (
              <View style={[styles.image, {backgroundColor:'#fff'}]}/>
            )}
            <View style={styles.commentWrapper}>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text style={styles.commentText}>{comment.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {user && (
        <View style={[styles.inputContainer, {bottom:isKeyboardVisible ? keyboardHeight - 50 : 0, paddingVertical:isKeyboardVisible ? 30 : 10}]}>
          <Image
            source={{uri:user.profilePic}}
            style={styles.image}
          />
          <FormItem style={[styles.input, {width:input ? '70%' : '80%'}]} onChangeText={text => setInput(text)} value={input}/>
          {input && (
            <TouchableOpacity style={styles.buttonContainer} onPress={commentPoster}>
              <Text style={[styles.buttonText, {color:theme.colors.primary}]}>Post</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
};





// Styles
const styles = StyleSheet.create({
  container:{
    bottom:0,
    height:'60%',
    width:'100%',
    borderRadius:10,
    position:'absolute',
    backgroundColor:'#212124'
  },
  top:{
    display:'flex',
    paddingTop:20,
    paddingBottom:20,
    alignItems:'center'
  },
  commentCount:{
    color:'#fff'
  },
  closeIconContainer:{
    top:18,
    right:20,
    position:'absolute',
  },
  closeIcon:{
    fontSize:18,
    color:'#fff',
  },
  scrollView:{
    marginBottom:70,
  },
  comment:{
    width:'100%',
    display:'flex',
    paddingLeft:20,
    borderColor:'#ccc',
    paddingVertical:10,
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:1,
  },
  commentWrapper:{
    display:'flex',
    paddingLeft:10
  },
  commentUsername:{
    color:'#fff'
  },
  commentText:{
    color:'#ccc',
    fontSize:12
  },
  inputContainer:{
    width:'100%',
    display:'flex',
    paddingLeft:10,
    paddingRight:20,
    flexDirection:'row',
    alignItems:'center',
    position:'absolute',
    backgroundColor:'#212124',
    justifyContent:'space-between'
  },
  image:{
    width:50,
    height:50,
    borderRadius:50
  },
  input:{
    paddingLeft:10,
    marginBottom:0,
    borderRadius:50,
    backgroundColor:'#fff'
  },
  buttonContainer:{

  },
  buttonText:{
    
  }
});





// Export
export default Comments;